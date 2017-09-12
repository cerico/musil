---
title: Introducing Web Components
date: '2017-09-11'
layout: post
tags: 
 - ES6
 - Javascript
brief: 
 - Replacing fetch and static html with web components in the existing router project.
---

This is intended as a part 3 of 'How to build a JS router' but can also work as a standalone guide. We can pick the repo up here, at stage 11, as a starting point.

Repo at stage 11: [https://github.com/cerico/how-to-js-router/releases/tag/0.11.1](https://github.com/cerico/how-to-js-router/releases/tag/0.11.1)

The problem we want to solve is that our html is living in html files, outside of our bundle and we're using Fetch to retrieve them. Our aim is to replace Fetch and get them inside the js bundle, and to do this we're going to use web components.

### Pre-requisites

[Part One](../2017-08-26---javascript-router/)

[Part Two](../2017-09-02---js-router-part-two-refresh/)

Not really pre-requisites if we clone the repo above, but a guide to how we got to this point.

### Spoilers

1. Create Basic HTMLElement files
2. Update routes object to use components
3. Inject Component into the DOM
4. Add a function
5. Next Steps


### 1. Create Basic HTMLElement files

```
➜  how-to-js-router git:(twelve-webc) ✗ cat src/js/components/default.js
export class DefaultComponent extends HTMLElement {

    connectedCallback() {
        console.log(DefaultComponent)
        console.log(HTMLElement)
        this.innerHTML = this.render();
    }

    render() {
        return (`i am the homepage`)
    }
}

customElements.define('default-component', DefaultComponent);
```


* extend html element and define it
    Here we take the standard HTMLElement that ships with our browser and extend it, creating a custom element, which we then define, or label (as 'default-component'), which is how it will appear in the DOM.

!['dom'](https://s3.amazonaws.com/how-to-js-router/dom.png 'dom')

* connectedCallback
	This is called as soon as the element is attached to the DOM,at which point we can call any functions that will manipulate the DOM, which is when we'll append our HTML.


[https://github.com/cerico/how-to-js-router/tree/0.12.0](https://github.com/cerico/how-to-js-router/tree/0.12.0)


### 2. Update routes object to use components

```
➜  how-to-js-router git:(thirteen-webc-router) ✗ cat src/js/routes.js
import { GlossopComponent } from './components/glossop'
import { KendalComponent } from './components/kendal'
import { DefaultComponent } from './components/default'

export const routes = {
    glossop: GlossopComponent,
    kendal:  KendalComponent,
    '' : DefaultComponent
}
```



Here we replace our 'new Pages' with our newly created components.


```
➜  how-to-js-router git:(thirteen-webc-router) cat -n src/js/delph.js
     1	export class Delph {
     2
     3	  constructor(routes,el,page){
   ...
    22	    let route =  this.routes[page];
    23	    if (route) {
    24	      console.log(route)
    25	    } else {
   ...
 ```
    
 We should now see our component being logged (line 24)

!['dom'](https://s3.amazonaws.com/how-to-js-router/logcomponent.png 'component')  

[https://github.com/cerico/how-to-js-router/tree/0.13.0](https://github.com/cerico/how-to-js-router/tree/0.13.0)

```
➜  how-to-js-router git:(fourteen-inject-component) ✗ cat -n src/js/delph.js
     1	export class Delph {
     2
   ...
    19
    20	  inject(component) {
    21	    const routerOutlet = this.el
    22	    while (routerOutlet.firstChild) {
    23	      routerOutlet.removeChild(routerOutlet.firstChild);
    24	    }
    25	    routerOutlet.appendChild(new component);
    26	  }
    27
    28	  load(page){
    29	    history.pushState({ page}, null, `/${page}`);
    30	    let route =  this.routes[page];
    31	    if (route) {
    32	      this.inject(route)
```

We can now append our component to the router element.

[https://github.com/cerico/how-to-js-router/tree/0.14.0](https://github.com/cerico/how-to-js-router/tree/0.14.0)

### 4. Add a function

```
➜  how-to-js-router git:(fifteen-function) ✗ cat -n src/js/components/kendal.js
     1	export class KendalComponent extends HTMLElement {
     2	    constructor() {
     3	        super();
     4	    }
     5
     6	    handleClick(){
     7	        console.log("clicked")
     8	    }
     9
    10	    connectedCallback() {
    11	        this.innerHTML = this.render();
    12	        this.addEventListener('click',this.handleClick)
    13	    }
```

Here we add a function during the connectedCallback lifecycle method. At the moment our entire Kendal 'page' is one component, and the click event applies to the whole page. 

[https://github.com/cerico/how-to-js-router/tree/0.15.0](https://github.com/cerico/how-to-js-router/tree/0.15.0)

### 5. Next Steps

In the next piece, we will look at state management, initially with Redux.