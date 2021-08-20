window.addEventListener('load', () => {
    modalListeners();
    inputLiteners();
});

let allPosts = [];
let newPostContent='';
let newPostGif;
let gifData = [];
let gifLoading = false;

const modalListeners = () => {
    let addBtn = document.querySelectorAll('.c-add-btn');
    let modal = document.querySelector('#addPostModal');

    let closeBtn = document.querySelectorAll('.c-btn-close');

    addBtn.forEach(btn => {
        btn.addEventListener('click', () => addModal());
    });

    closeBtn.forEach(btn => {
        btn.addEventListener('click', () => removeModal());
    });

    modal.addEventListener('click', (e) => { if (e.target.classList.contains("c-modal")) removeModal() });
}

const inputLiteners = () => {
    const contentInput = document.querySelector('#postContent');
    const gifContainer = document.querySelector('#gifContainer');
    const gifText = document.querySelector('#gifText');
    const createBtn = document.querySelector('#createGifBtn');

    contentInput.addEventListener('change', (e) => {
        newPostContent = e.target.value;
    });

    gifContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('c-add-gif')) {
            gifContainer.classList.remove('c-add-gif');
            gifContainer.classList.add('c-gifs-container');
            gifContainer.innerHTML = `<div class="container c-no-gifs-found h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                        <span class="d-flex"></span>
                                        <p class="pt-3">Search for Gifs.</p>
                                    </div>`;
            gifText.parentElement.classList.remove('d-none');
        }
    });

    gifText.addEventListener('input', (e) => {
        if (e.target.value.length > 1 &&e.target.value.length%2==0 && !gifLoading) {
            getGifs(e.target.value);
        }
        else if(!e.target.value||!e.target.value.length){
            gifContainer.innerHTML = `<div class="container c-no-gifs-found h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                        <span class="d-flex"></span>
                                        <p class="pt-3">Search for Gifs.</p>
                                    </div>`;
        }
    });

    createBtn.addEventListener('click', ()=>{
        if(newPostContent || newPostGif){
            let newPost = {content: newPostContent, gif: newPostGif? newPostGif.images.downsized.url: null};
            allPosts.unshift(newPost);
            setPostsContent();
            removeModal();
        }
    });
}

const setPostsContent = ()=>{
    const postsContainer = document.querySelector('#postsContainer');
    let postsData="";
    if(allPosts.length){
        postsData = `<div class="row">
                        ${
                            allPosts.map(post=>{
                                return(
                                    `<div class="col-md-10 col-lg-8 py-3">
                                    <div class="c-post w-100 p-5 c-shadow-large">
                                        <div class="c-post-head d-flex align-items-center mb-4">
                                            <span class="c-user-icon d-flex align-items-center justify-content-center c-shadow-small">
                                                <img src="./images/useIcon.svg" alt="User Icon">
                                            </span>
                                            <h3 class="ps-4 mb-0">User Name</h3>
                                        </div>
                                        <div class="w-100 c-post-body d-flex flex-column">
                                            <div class="w-100 c-post-text">
                                                <p>${post.content}</p>
                                            </div>
                                            ${
                                                post.gif && post.gif.length?
                                                `<div class="c-image-container container px-0">
                                                <div class="row">
                                                    <div class="col-lg-6 col-md-8">
                                                        <img src="${post.gif}" alt="gif" class="c-gif w-100">
                                                    </div>
                                                </div>
                                            </div>`
                                            :
                                            ''
                                            }
                                        </div>
                                    </div>
                                </div>`
                                )
                            })
                        }
                    </div>`;
    }
    postsContainer.innerHTML = postsData;    
}

const getGifs = async (query) => {
    gifLoading = true;
    const gifContainer = document.querySelector('#gifContainer');
    gifContainer.innerHTML = `<div class="container h-100 d-flex align-items-center justify-content-center">
                                <span class="c-loader d-flex"></span>
                            </div>`;
    let response = await getAPI(query);
    if(response && response.meta && response.meta.status==200){
        setGifs(response.data);
    }
    else{
        gifContainer.innerHTML = `<div class="container c-no-gifs-found h-100 d-flex flex-column align-items-center justify-content-center text-center">
                        <span class="d-flex"></span>
                        <p class="pt-3">Search for Gifs.</p>
                    </div>`;
    }
    gifLoading = false;
}

const setGifs=(data)=>{
    gifData = data;
    const gifContainer = document.querySelector('#gifContainer');
    if(gifData && gifData.length){
        let wrapperContent = `<div class="row mx-0">
                                ${
                                    gifData.map(item=>{
                                        return(
                                            `<div class="col-4 p-2 c-gif-option position-relative">
                                                <span class="d-flex position-absolute c-tick-icon"></span>
                                                <img src="${item.images.downsized.url}" alt="">
                                            </div>`
                                        )
                                    }).join('')
                                }
                                </div>`;
        gifContainer.innerHTML = wrapperContent;
        gifClickListener();
    }
    else{
        gifContainer.innerHTML = `<div class="container c-no-gifs-found h-100 d-flex flex-column align-items-center justify-content-center text-center">
                        <span class="d-flex"></span>
                        <p class="pt-3">Search for Gifs.</p>
                    </div>`;
    }
}

const gifClickListener=()=>{
    const gifOptions = document.querySelectorAll('.c-gif-option');

    gifOptions.forEach((item,i)=>{
        item.addEventListener('click', ()=>{
            newPostGif = gifData[i];
            gifOptions.forEach(option=>option.classList.remove('c-selected-gif'));
            item.classList.add('c-selected-gif');
        });
    })
}

const addModal = () => {
    let backdrop = document.createElement('div');
    let docBody = document.querySelector('body');
    let modal = document.querySelector('#addPostModal');

    backdrop.setAttribute('class', 'modal-backdrop fade');
    docBody.appendChild(backdrop);
    modal.style.display = "block";
    docBody.classList.add('modal-open');
    docBody.classList.add('overflow-hidden');
    setTimeout(() => {
        backdrop.classList.add('show');
        modal.classList.add('show');
    }, 300);
}

const removeModal = () => {
    let backdrop = document.querySelector('.modal-backdrop');
    let docBody = document.querySelector('body');
    let modal = document.querySelector('#addPostModal');
    const gifContainer = document.querySelector('#gifContainer');
    const gifText = document.querySelector('#gifText');
    const contentInput = document.querySelector('#postContent');

    modal.classList.remove('show');
    docBody.classList.remove('modal-open');
    docBody.classList.remove('overflow-hidden');
    backdrop.classList.add('show');
    gifContainer.classList.remove('c-gifs-container');
    gifContainer.classList.add('c-add-gif');
    gifText.parentElement.classList.add('d-none');
    gifContainer.innerHTML = `<p class="mb-0">Add Gif</p><span>+</span>`;
    gifText.value = '';
    contentInput.value = '';
    newPostContent='';
    newPostGif=null;
    setTimeout(() => {
        modal.style.display = "none";
        docBody.removeChild(backdrop);
    }, 300);
}

const getAPI=async (query)=>{
    let url = `https://api.giphy.com/v1/gifs/search?api_key=e2DHPgZPUw9l3qPGanCm7Av2a6qvFkP1&q=${query}&limit=12`;
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
      
    let response = await fetch(url, requestOptions);
    result = await response.text();
    try {
       result = await JSON.parse(result); 
    } catch (error) {}

    return result;
}