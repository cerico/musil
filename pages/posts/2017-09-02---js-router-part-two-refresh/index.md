---
title: JS Router Part Two - Refresh
date: '2017-09-02'
layout: post
tags: 
 - Javascript
 - ES6
brief: Javascript Router Part 2. Extending the JS router to update the URL, and handle refreshing and hard linking.
---

In part 1, our client side router works fine, and loads our html but our URL doesn't update, which means we don't have a unique address for any of our pages, we're always at the root URL. Today we're going to flesh out our router using pushState and HTML5's history facility.

___

### Pre-requisites.

[Part One](../2017-08-26---javascript-router/)

___

### Updating URL

There are two main ways to do this, with either hashbang URLs (eg url.com/#hereford), or using pushState, which gives us a standard looking URL. Lets be honest, those hashbang URL's don't feel very solid! With pushState a client rendered URL will look the same as a server rendered one.

```
➜  how-to-js-router git:(six) ✗ cat src/js/delph.js
```
```
export class Delph {
    
    constructor(routes,el){
        this.routes = routes
        this.el = el
    }

    load(page){ 
        
        history.pushState({ page}, null, `/${page}`);
        let route =  this.routes[page];
        route.load().then(r => route.show(this.el));
    }
}
```

Here we are taking the HTML5 history api and into it we push our page object, page title (null), and page url.

![alt text](https://dl.dropboxusercontent.com/s/imbm5wdf8xv7s5b/9CE60511-B1A8-4096-A439-25F2E48F5E9B-567-00000F28303615AF.gif?dl=0 'update url')

Repo at stage 6: [https://github.com/cerico/how-to-js-router/releases/tag/0.6](https://github.com/cerico/how-to-js-router/releases/tag/0.6)
___

### Handling refresh and direct linking

We're now updating the URL as part of the router's load function, which is only run when we click on a link. But what happens if we go to a link directly, or refresh the page. We just get the index page again, but why is this?

Its down to our webpack configuration, and specifically where we us historyApiFallback and rewrites. Whats actually happening is *whatever* url we put in on first load - is going to give us the index.html page - and any javascript that runs on page load. Updating the URL and changing the content are actually *unrelated* events that both happen in the routers load function, and when we go to a page directly, the URL may look right, but we're not telling our router to load any content.

So we want our router's load function to fetch the right page on page load. We can do this by grabbing the URL on initialization of the router, and passing it to the load function

```
➜  how-to-js-router git:(seven) cat -n src/js/index.js
```
```
   ...
     4	export class Index {
     5
     6	    constructor(){
     7	      const page = window.location.pathname.substr(1) || ''
     8	      let main = document.getElementById('main')
     9	      this.delph = new Delph(routes, main, page)
    10	      this.makeHeader(routes)
    11	    }
    ...
```

We can grab the route we want from the URL (line 7), which will give us e.g 'hereford', 'glossop' or in the case of the root url - nothing, in which case we'll use an empty string. We can then pass this to our router (line 9)

```
➜  how-to-js-router git:(seven) ✗ cat src/js/delph.js
```
```
export class Delph {

    constructor(routes,el,page){
        this.routes = routes;
        this.el = el;
        this.load(page)
    }

    load(page){
        history.pushState({ page}, null, `/${page}`);
        let route =  this.routes[page];
        route.load().then(r => route.show(this.el));
    }
}
```

We can pick up the page pathname string here, and pass to the load function when initiated. Our named pages will now work with direct links and with refreshes. But now the function runs on page load, how do we handle the index route. And what about handling 404s?

Repo at stage 7: [https://github.com/cerico/how-to-js-router/releases/tag/0.7](https://github.com/cerico/how-to-js-router/releases/tag/0.7)  
___

### Index Route

The main issue for the router now, is regarding the index route. Firstly, there isn't one in our routes object, so there's nothing to load. But what do we call it, as the pathname of the index route is going to be an empty string, and we have to call its html file *something*. Lets call it default, for now. 

```
➜  how-to-js-router git:(eight) ✗ cat src/js/routes.js
```
```
import { Page } from './page';

export const routes = {
    glossop: new Page('glossop'),
    kendal:  new Page('kendal'),
    hereford:  new Page('hereford'),
    malton:  new Page('malton'),
    '' : new Page('default')
}
```

And create a default view for it to load - and we'll create the 404 view at the same time.

```
➜  how-to-js-router git:(eight) ✗ cat src/views/default.html
i am m the homepage
```


But as the text for the link for the default route is just an empty string, we have nothing to click on.

```
 how-to-js-router git:(eight) ✗ cat -n src/js/index.js
```
```
    ...
    13	    makeHeader(routes){
    14	      let el = document.getElementById('header')
    15	      Object.keys(routes).map(route => {
    16	        let e = document.createElement("li");
    17	        e.innerHTML = route || "index"
    ...
```
    
So in the case of an our named route being an empty string, we can just use 'index' for the text of the link, but still pass the load function the 'real' empty string, to tally up with the routes object.

Repo at stage 8: [https://github.com/cerico/how-to-js-router/releases/tag/0.8](https://github.com/cerico/how-to-js-router/releases/tag/0.8)
___

### 404

Now the index route is fixed, but the router breaks if we type in the wrong pathname, we have no 404. Simple enough to fix, we need a 404 html file, and a catch in the router's load function, to show it when a named route can't be found.

```
➜  how-to-js-router git:(nine) ✗ cat src/js/delph.js
```
```
export class Delph {
    
    constructor(routes,el,page){
        this.routes = routes;
        this.el = el;
        this.load(page)
    }

    load(page){
        history.pushState({ page}, null, `/${page}`);
        console.log(page)
        let route =  this.routes[page];
        if (route) {
            route.load().then(r => route.show(this.el));
        } else {
            this.el.innerHTML = "no page found"
        }
    }
}
```

If we're unable to find a route in the routes object(due to mistyped link), we can simply attach an error message to the element

Repo at stage 9: [https://github.com/cerico/how-to-js-router/releases/tag/0.9](https://github.com/cerico/how-to-js-router/releases/tag/0.9)
___

### The Back Button

Try clicking the back button....and nothing happens. And people really love the back button! The URL updates, but the content doesn't change

vid

If we remember from before, the URL updating and the content loading are unrelated events that both happen during the router's load function, giving the appearance of being connected. The URL changing is part of HTML5's History API, so lets hook into that and change the content whenever it updates.

```
➜  how-to-js-router git:(ten) cat -n src/js/delph.js
```
```
     1	export class Delph {
     2
     3	  constructor(routes,el,page){
     4	    this.routes = routes;
     5	    this.el = el;
     6	    this.load(page)
     7	    this.handleBackButton()
     8	  }
     9
    10	  handleBackButton(){
    11	    window.onpopstate = () => {
    12	      let content = "";
    13	      if (event.state) {
    14	        content = event.state.page;
    15	        this.load(content)
    16	      }
    17	    }
    18	  }
    ...
```

We've written a new 'handleBackButton' function, and we initiate it when the router is initiated. window.onpopstate is part of the HTML5 API, which we can run in this function. When the back button is pressed, the event listener is triggered and we have access to the previous page's pathname. We can simply feed this to the load function, the same as if we were just clicking a link.

However, if we use the back button consecutively, no changes are registered after the first press, because the load function is immediately updating the pushState again, so we want to disable that from happening. Lets pass the load function a second argument, true (for back button pressed. And then only update pushState when this isn't the case.

```
➜  how-to-js-router git:(master) cat -n src/js/delph.js
     1	export class Delph {
     2
     3	  constructor(routes,el,page){
     4	    this.routes = routes;
     5	    this.el = el;
     6	    this.load(page)
     7	    this.handleBackButton()
     8	  }
     9
    10	  handleBackButton(){
    11	    window.onpopstate = () => {
    12	      let content = "";
    13	      if (event.state) {
    14	        content = event.state.page;
    15	        this.load(content, true)
    16	      }
    17	    }
    18	  }
    19
    20	  load(page, backButtonUsed){
    21	    if (!backButtonUsed){
    22	      history.pushState({ page}, null, `/${page}`);
    23	    }
    ```

Repo at stage 10: [https://github.com/cerico/how-to-js-router/releases/tag/0.10.1](https://github.com/cerico/how-to-js-router/releases/tag/0.10.1)

___

### Using Express

So, our router works in the dev environment, but we don't want to use webpack in production, we'll use express. So first we'll need to install express and path, and create a build script and a production script.

```
➜  how-to-js-router git:(eleven-express) ✗ cat -n package.json
     ...
     6	  "scripts": {
     7	    "dev": "webpack-dev-server --config webpack/webpack.config.js --open",
     8	    "build": "webpack --config webpack/webpack.prod.config.js",
     9	    "prod": "node server.js"
    10	  },
    ...
    21	  "devDependencies": {
    22	    "webpack": "^3.5.5",
    23	    "webpack-dev-server": "^2.7.1"
    24	  },
    25	  "dependencies": {
    26	    "path": "^0.12.7",
    27	    "express": "^4.15.3"
    28	  }
    29	}
    ...
```

Production webpack build is very similar to our existing one

```
➜  how-to-js-router git:(eleven-express) ✗ cat webpack/webpack.prod.config.js
```
```
const path = require('path')

module.exports = options => {
  return {
    entry: './src/js/index.js',
    output: {
      path: path.join(__dirname, '../', '/dist'),
      filename: 'bundle.js',
    }
  }
} 
```

We'll also need to temporaily copy our index.html file into dist, as thats what express is going to serve We need to use path to get an absolute location for the production bundle (in this case, our current directory, then one level up, then dist)

```
➜  how-to-js-router git:(eleven-express) ✗ cat server.js
```
```
const express = require('express');
const server = express();

server.use(express.static('dist'));
server.listen(process.env.PORT || 5000);
```

This serves our production bundle on port 5000 - all good, except it doesn't handle refresh or direct linking. If we remember back to the dev webpack, we had a historyApiFallback rewrite function, sending all requests initiall to index.html, now we need to do something similar here as well. A package we can use for this is connect-history-api-fallback.

```
how-to-js-router git:(dev) ✗ npm install connect-history-api-fallback
```

We'll add this to the server.js file and use it...

```
➜  how-to-js-router git:(kstephen) ✗ cat server.js
```
```
const express = require('express');
const history = require('connect-history-api-fallback')
const server = express();
const staticFileMiddleware = express.static('dist');
server.use(staticFileMiddleware);
server.use(history({
  disableDotRule: true,
  verbose: true
}));
server.use(staticFileMiddleware);
server.listen(process.env.PORT || 5000);
```

___

### Handling static assets

Our HTML files aren't being bundled, so we'll need to make sure they are accessible to the production build. So we can add a new npm script 'copy-files', which can run every time a build finishes.

```
➜  how-to-js-router git:(kstephen) ✗ cat -n package.json
```
```
...
     6	  "scripts": {
     7	    "dev": "webpack-dev-server --config webpack/webpack.config.js --open",
     8	    "build": "webpack --config webpack/webpack.prod.config.js && npm run copy-files",
     9	    "copy-files": "cp src/index.html dist && cp -r views dist",
    10	    "prod": "node server.js"
    11	  }
    ...
```

This will give us the following structure for the production build, and copying these files as part of the build process means we only need to worry about maintaining one set.

```
➜  how-to-js-router git:(kstephen) ✗ tree dist
dist
├── bundle.js
├── index.html
└── views
    ├── default.html
    ├── glossop.html
    ├── hereford.html
    ├── kendal.html
    └── malton.html

1 directory, 7 files
```

___

### Gotchas - File Locations

Caveat, as we're only maintaining one set of html files, and copying them from to dist as part of the build process, we have to make sure we remove any reference to 'src' in our js files. The views will be at the top level, which in dev with webpack will be the top level of the repo, but in production, 'dist' will be the top level, as thats where we are telling node to serve static assets from. This is best illustrated by tree.

```
➜  how-to-js-router git:(kstephen) ✗ tree | more
.
├── README.md
├── dist
│   ├── bundle.js
│   ├── index.html
│   └── views
│       ├── default.html
│       ├── glossop.html
│       ├── hereford.html
│       ├── kendal.html
│       └── malton.html
...
├── server.js
├── src
│   ├── index.html
│   └── js
│       ├── delph.js
│       ├── index.js
│       ├── page.js
│       └── routes.js
├── views
│   ├── default.html
│   ├── glossop.html
│   ├── hereford.html
│   ├── kendal.html
│   └── malton.html
└── webpack
    ├── webpack.config.js
    └── webpack.prod.config.js
```
```


In both dev and prod, we want to make sure fetch is retrieving from the top level, so here's where we want to make sure there are no references to 'src'.


```
➜  how-to-js-router git:(kstephen) ✗ cat -n src/js/page.js
     1	export class Page {
     2	  constructor(url) {
     3	    this.url = `views/${url}.html`;
...
```


Repo at stage 11: [https://github.com/cerico/how-to-js-router/releases/tag/0.11](https://github.com/cerico/how-to-js-router/releases/tag/0.11)
___

### Next

In part 3 we'll include our static html in the compiled bundle, along with some images and css, and tidy things up.












