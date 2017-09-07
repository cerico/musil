---
title: Introducing Web Components
date: '2017-09-07'
layout: post
tags: 
 - ES6
 - Javascript
brief: 
 - Replacing fetch and static html with web components in the existing router project.
---

This is intended as a part 3 of 'How to build a JS router' but can also work as a standalone guide. We can pick the repo up here, at stage 11, as a starting point.

Repo at stage 11: [https://github.com/cerico/how-to-js-router/releases/tag/0.11](https://github.com/cerico/how-to-js-router/releases/tag/0.11)

The problem we want to solve is that our html is living in html files, outside of our bundle and we're using Fetch to retrieve them. Our aim is to replace Fetch and get them inside the js bundle, and to do this we're going to use web components.

### Pre-requisites

[Part One](../2017-08-26---javascript-router/)
[Part Two](../2017-09-02---js-router-part-two-refresh/)

Not really pre-requisites if we clone the repo above, but a guide to how we got to this point.

### Spoilers

1. Install webcomponents
2. Update dev webpack
3. Create Component files
4. Update routes object to use components
5. Register the Components
6. Inject Component on load/click
7. Import original views
8. Production

### 1. Install webcomponents

```
➜  origami git:(master) cat package.json
{
  "name": "how-to-js-router",
...
  "dependencies": {
    "express": "^4.15.4",
    "path": "^0.12.7",
    "@webcomponents/webcomponentsjs": "git://github.com/webcomponents/webcomponentsjs.git#v1.0.0"
  }
}
```

Our package.json should look like this.

### 2.  Update dev webpack

```
➜  how-to-js-router git:(twelve-components) ✗ cat -n webpack/webpack.config.js
     1	let webpack = require('webpack');
     2
     3	module.exports = options => {
     4	  return {
   ...
     9	    devtool: 'source-map',
    10	    plugins: [new webpack.IgnorePlugin(/vertx/)],
    ...
```
    

It will still actually work for our simple setup if we don't add this IgnorePlugin line, but it will throw the following warning at us if we don't

```
WARNING in ./node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js
Module not found: Error: Can't resolve 'vertx' in /Users/garethrobertl...
```

You can read more about why here

[https://github.com/webcomponents/webcomponentsjs/issues/794](https://github.com/webcomponents/webcomponentsjs/issues/794)


### 3. Create Component files

```
export class MaltonComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.render();
    }

    render() {
        return (<div>hello from malton</div>);
    }
}
```
Each component we create will have a constructor, for when its initiated, a render function for what gets outputted - and a connectedCallback function which runs the render function.

In short, the constructor is called when the element is created, and connectedCallback is called when attached to the DOM, at which point we can attach the content we want.

### 4. Update routes object to use components


```
import { MaltonComponent } from './components/malton'
import { GlossopComponent } from './components/glossop'
import { KendalComponent } from './components/kendal'
import { HerefordComponent } from './components/hereford'
import { DefaultComponent } from './components/default'



export const routes = {
    glossop: GlossopComponent,
    kendal:  KendalComponent,
    hereford:  HerefordComponent,
    malton:   MaltonComponent,
    '' : DefaultComponent
}
```


A simple swapping out of pages for components.

### 5. Register the Components

Now we need to register the components, they'll have a tagName (eg <my-custom-element></my-custom-element>, and the connectedCallback in the component itself, this is where we'll attach our component, as we saw before. We'll register our components on index initialization, prior to initializing the router.

```
import { Delph } from './delph'
import { routes } from './routes'
import { ComponentRegistry } from "./utils/component-registry";

export class Index {

    constructor(){
      const page = window.location.pathname.substr(1) || ''
      let main = document.getElementById('main')
      this.registerComponents(routes)
      this.delph = new Delph(routes, main, page)
 ...

    registerComponents(routes){
      return ComponentRegistry.register(routes);
    }
...
```

We need to register our new components before we can use them, so the order here is important. We register our components before we instantiate our router. Lets look at the ComponentRegistry.

```
➜  how-to-js-router git:(thirteen-registering) ✗ cat src/js/utils/component-registry.js
export class ComponentRegistry {
    static register(components) {
        Object.entries(components).map(obj => {
            let tag = obj[0] || 'index'
            let component = {
                tagName : `core-${tag}`,
                callBack: obj[1]
            }
            window.customElements.define(component.tagName, component.callBack);
          })
    }
}
```

Quite a bit happening here so let run through each piece.

* The ComponentRegistry has one function 'register', which will take all the components passed to it
* tag - We'll create a tagName from the name of the component. And as the root ('/') is nameless, we'll give any nameless route a name of index.
* callback - This is the component we want attached (the second parameter in each route object.

More on this here [https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)

Lets go back to our router, comment out the route.load line from the previous article, and just console.log what we have

```
 how-to-js-router git:(thirteen-registering) cat -n src/js/delph.js
     1	export class Delph {
     2
   ...
    24	    let route =  this.routes[page];
    25	    if (route) {
    26	      console.log(new route)
    27	      // route.load().then(r => route.show(this.el));
   ...
```


![view](https://s3.amazonaws.com/how-to-js-router/element.png
 "view") 

### 6. Inject Component on load/click

So this is great, we have a custom element but now we need to append it to the DOM. We'll make an inject function in our router, and pass the appropriate element to it.

```
➜  how-to-js-router git:(fourteen-inject) cat -n src/js/delph.js
     1	export class Delph {
     2
     3	  constructor(routes,el,page){
     4	    this.routes = routes;
     5	    this.el = el;
   ...
    20	  inject(component) {
    21	    const routerOutlet = this.el
    22	    while (routerOutlet.firstChild) {
    23	      routerOutlet.removeChild(routerOutlet.firstChild);
    24	    }
    25	    routerOutlet.appendChild(new component);
    26	  }
    27
    28	  load(page, backButtonUsed){
    29	    if (!backButtonUsed){
    30	      history.pushState({ page}, null, `/${page}`);
    31	    }
    32	    let route =  this.routes[page];
    33	    if (route) {
    34	      this.inject(route)
    35	    } else {
    36	      this.el.innerHTML = "no page found"
    37	    }
    38	  }
    39	}
```
    

The inject function receives the custom element, and appends it to the router element, which is the element we passed the router on instantiation.

githublink
   
### 7. Import original views

If we remember back to our original static html files that we were retrieving with fetch, we can now turn these into template strings and import then into our components. So we can go from this

```
➜  how-to-js-router git:(fifteen-views) cat views/glossop.html
<ul style="color:white;background: cornflowerblue;display:block;list-style:none">
    <li>glossop</li>
    <li>hadfield</li>
    <li>tintwistle</li>
</ul>
```

to this...

```
➜  how-to-js-router git:(fifteen-views) ✗ cat src/js/views/glossop.js
export const html =

`<ul style="color:white;background: cornflowerblue;display:block;list-style:none">
  <li>glossop</li>
  <li>hadfield</li>
  <li>tintwistle</li>
</ul>`
```

and import it into the component

```
import { html } from '../views/glossop'

export class GlossopComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.render();
    }

    render() {
        return html
    }
}
```

And it will now be part of our bundle.

github


### 8. Production

Thanks to our original setup, there isn't actually anything to change from the servers perspective. 








  
  


