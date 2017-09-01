---
title: How to build a JS Router
date: '2017-08-26'
layout: post
tags:
 - javascript
---

Introduction.
---
In this application we'll learn how to build a client-side router with vanilla Javascript. We have 3 main requirements

* It should link us to a new page without a server visit
* It should handle the back button
* It should handle page refreshes and direct linking

Pre-requisites.
---
Npm and Node. These are the versions I'm running

```
➜  ~ node -v
v7.7.2
➜  ~ npm -v
5.3.0
```


TLDR / Repo
---
Repo is at [https://github.com/cerico/how-to-js-router](https://github.com/cerico/how-to-js-router)

Stage One - Initial Setup
---

```
➜  how-to-js-router git:(dev) tree
.
├── package-lock.json
├── package.json
├── src
│   ├── index.html
│   └── js
│       └── index.js
└── webpack
    └── webpack.config.js

3 directories, 5 files
```

```
package.json

  "scripts": {
    "dev": "webpack-dev-server --config webpack/webpack.config.js --open"
  },
   "devDependencies": {
    "webpack": "^3.5.5",
    "webpack-dev-server": "^2.7.1"
  }
```

We just need webpack and webpack-dev-server, so jump ahead and install those with npm install.

```
➜  how-to-js-router git:(master) cat webpack/webpack.config.js
```
```
module.exports = options => {
  return {
    entry: './src/js/index.js',
    output: {
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    devServer: {
       port: 2013,
       host: '0.0.0.0',
        historyApiFallback: {
          index: 'src/index.html',
      },
    },
  }
}
```

All we need to know for now for webpack, is the entrypoints for the index.html file and main js, src/js/index.js and src/index.html.

```
➜  how-to-js-router git:(dev) cat src/js/index.js
```
```

export class Index {

    constructor(){
      let header = document.getElementById('header')
      let main = document.getElementById('main')
      header.innerHTML = "header"
    }


};
document.addEventListener('DOMContentLoaded', () => {
  new Index()
});
```

This is our view before we add the router, we should be outputting the word text to screen, and nothing more.
 
![view](https://s3.amazonaws.com/how-to-js-router/how-to-js-router-one.png
 "view")

Repo at stage 1:  [https://github.com/cerico/how-to-js-router/tree/0.1](https://github.com/cerico/how-to-js-router/tree/0.1)

Stage Two - Attach Click
---
```
➜  how-to-js-router git:(dev) ✗ cat src/js/delph.js
```

```
export class Delph {

    constructor(el){
        this.el = el
    }

    load(page){
        this.el.innerHTML = page
    }
}
```
Here is is the beginning of our router. Its going to be initiated with an element, and have a load function that will attach some html to the element. And we will export it for use in our index file. Thats it for now!

```
➜  how-to-js-router git:(dev) ✗ cat src/js/index.js
```
```
import { Delph } from './delph'

export class Index {

    constructor(){
      
      let main = document.getElementById('main')
      this.delph = new Delph(main)
      
      let header = document.getElementById('header')
      header.innerHTML = "header"
      header.addEventListener('click', () => {this.load('glossop')})
    }

    load(link){
      this.delph.load(link)
    }

};
document.addEventListener('DOMContentLoaded', () => {
  new Index()
});
```

Returning to the index file, we import our new 'Delph' router. We then initiated an instance of the router for us to use., and we pass it the 'main' element. We also attach a click event to the header, which will run the load function and pass it some text, 'glossop'. The load function passes this text to our nascent router's load function, which will attach it to the 'main' element we passed it earlier.

![view](https://dl.dropboxusercontent.com/s/jw1jrxphzhmksnt/25FEE563-0988-4789-BEC7-A142DA34BFE6-517-00006B2B1B98B4F1.gif?dl=0 "click")

Repo at stage 2:  [https://github.com/cerico/how-to-js-router/tree/0.2](https://github.com/cerico/how-to-js-router/tree/0.2)

Stage Three - Routes
----
So now we have a placeholder, where our router is going to live, but now we need to pass it some routes so we can display something other 'glossop'. Lets make a routes object.


```
➜  how-to-js-router git:(dev) ✗ cat src/js/routes.js
```


```
export const routes = {
    glossop: 'derbyshire',
    kendal:  'cumbria',
    hereford:  'herefordshire',
    malton:  'north yorkshire'
}
```


Four named routes, each will return the county they are in when accessed. Now lets import this into our index.js file, and pass it to our Delph router.

```
➜  how-to-js-router git:(dev) ✗ cat src/js/index.js
```
```
import { Delph } from './delph'
import { routes } from './routes'
export class Index {
    constructor(){      
      var header = document.getElementById('header')
      var main = document.getElementById('main')
      header.innerHTML = "click"
      header.addEventListener('click', () => {this.load('glossop')})
      this.delph = new Delph(routes,main)
    }
    load(link){
      this.delph.load(link)
    }
};
document.addEventListener('DOMContentLoaded', () => {
  new Index()
});
```


```
➜  how-to-js-router git:(dev) ✗ cat src/js/delph.js
```
```
export class Delph {

    constructor(routes,el){
        this.routes = routes
        this.el = el
    }

    load(page){
        this.el.innerHTML = page
    }
}
```

Great, so now we've passed it the routes, but the click event is still just passing it 'glossop'. And, with 'header' we still only have one link to click on!

Repo at stage 3:  [https://github.com/cerico/how-to-js-router/tree/0.3](https://github.com/cerico/how-to-js-router/tree/0.3)

Stage Four - Create Links and display route content
---

Lets populate the header with a link for each route. We could make an array with each of the named routes, and iterate over them, attaching a click handler. But we already have a routes object, so lets iterate over that instead.

```
➜  how-to-js-router git:(dev) ✗ cat src/js/index.js
```
```
import { Delph } from './delph'
import { routes } from './routes'

export class Index {

    constructor(){
      var main = document.getElementById('main')
      this.delph = new Delph(routes,main)
      this.makeHeader(routes)
    }

    makeHeader(routes){
      let el = document.getElementById('header')
      Object.keys(routes).map(route => {
        var e = document.createElement("li");
        e.innerHTML = route
        e.addEventListener('click', () => {this.load(route)})
        el.appendChild(e);
      })
    }

    load(link){
      this.delph.load(link)
    }

};
document.addEventListener('DOMContentLoaded', () => {
  new Index()
});
```

Here, we pass our routes object to a makeHeader function, which iterates over each, and creates a click handler for each link, passing its route to the load function. But we don't want to display the key, or route name - we want to display the data assocated with it. So we can modify the router to do this, by finding the data associated with the route we have been passed.

```
➜  how-to-js-router git:(dev) cat src/js/delph.js
```
```
export class Delph {

    constructor(routes,el){
        this.routes = routes
        this.el = el
    }

    load(page){
        const data = this.routes[page]
        this.el.innerHTML = data
    }
}
```

![view](https://dl.dropboxusercontent.com/s/c4e4g0euoh0lhy6/C25955EF-BBED-406A-8B05-2408D80FEDB0-517-00006BF7DFD0291D.gif?dl=0 "links")

Repo at stage 4:  [https://github.com/cerico/how-to-js-router/tree/0.4](https://github.com/cerico/how-to-js-router/tree/0.4)

Stage Five - Fetch
---

Great, we now have a working router. Which works just fine...but we're fairly limited and have to add all our page data inside the routes object, which is going to get pretty unwieldly. A better approach is to put our html into template files, and use fetch to retrieve them.

```
➜  how-to-js-router git:(dev) ✗ tree src/views
src/views
├── glossop.html
├── hereford.html
├── kendal.html
└── malton.html

0 directories, 4 files
```

```
➜  how-to-js-router git:(dev) ✗ cat src/views/glossop.html
<ul style="background: cornflowerblue;display:block">
    <li>glossop</li>
    <li>hadfield</li>
</ul>
```


Now we can have an easily readable html file and use fetch to insert it into the page. We'll need to create a Page component, to handle this.

```
➜  how-to-js-router git:(dev) ✗ cat src/js/page.js
export class Page {
  constructor(url) {
    this.url = `src/views/${url}.html`;
  }

  load() {
    return fetch(this.url).then(r => r.text())
    .then(data => this.html = data)
    .catch(e => console.log("Booo"))
  }

  show(el) {
    el.innerHTML = this.html;
  }
}
  ```
  
So whats happening here? We have three main parts to go through

* constructor - when a new instance of the page is initiated, it will be passed a url, e.g 'hereford', we'll turn this into a useable path - 'views/hereford.html'.
* load - the url that the html lives at. Once this is retrieved we'll attach store the returned html in 'this.html'.
* show - This attaches the html to whatever element it is passed.

Now lets updated the routes file to use the Page component.

```
➜  how-to-js-router git:(dev) ✗ cat src/js/routes.js
```
```
import { Page } from './page';

export const routes = {
    glossop: new Page('glossop'),
    kendal:  new Page('kendal'),
    hereford: new Page('hereford'),
    malton:  new Page('malton')
}
```

So, now each of our routes creates an instance of the Page component, which will handle retrieving the appropriate html via fetch.

And if we update the Delph router

```
➜  how-to-js-router git:(dev) ✗ cat src/js/delph.js
```
```
export class Delph {

    constructor(routes,el){
        this.routes = routes
        this.el = el
    }

    load(page){
        let route =  this.routes[page]
        route.load().then(r => console.log(r))
    }
}
```

Instead of attaching text directly, we have access to each route's Page object, and load function, which will return us the html. From there its a short step to sending that back to the Page object's show function, along with the element we'd like it attached to.

```
➜  how-to-js-router git:(dev) ✗ cat src/js/delph.js
```
```
export class Delph {

    constructor(routes,el){
        this.routes = routes
        this.el = el
    }

    load(page){
        let route =  this.routes[page]
        route.load().then(r => route.show(this.el))
    }
}
```

![view](https://dl.dropboxusercontent.com/s/1eezazgojfxtbgm/3245843A-4405-4732-B6FA-8DBEDC2BF784-517-00006CA2AEB59D6C.gif?dl=0)

Repo at stage 5:  [https://github.com/cerico/how-to-js-router/tree/0.5](https://github.com/cerico/how-to-js-router/tree/0.5)

Next
---

In part II we'll look at updating the url, and handling refreshing and permanent links.


