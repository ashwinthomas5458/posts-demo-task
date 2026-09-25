# posts-demo-task

A static, framework-free "Post Demo" page (heading "All Posts") where users create posts with an attached GIF.

## Overview

`index.html`, `css/` (Bootstrap plus `style.css`) and `js/app.js`. On load, `app.js` keeps posts in memory, opens and closes a create-post modal, and searches GIFs through the Giphy search API (`api.giphy.com/v1/gifs/search`, limited to 12 results) so one can be attached to a new post. Posts are not persisted; they are lost on reload.

## Running

No build step or dependencies. Serve the directory with any static file server and open `index.html`. GIF search needs network access to Giphy.

## Security note

`js/app.js` contains a hard-coded Giphy API key. Rotate it and load it from configuration outside version control (ideally through a server-side proxy).
