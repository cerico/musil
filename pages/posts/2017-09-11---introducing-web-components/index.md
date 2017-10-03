---
title: Introducing Web Components
date: '2017-09-11'
layout: post
tags: 
 - ES6
 - Javascript
brief: Replacing fetch and static html with web components in the existing router project.
---

This is intended as a part 3 of 'How to build a JS router' but can also work as a standalone guide. We can pick the repo up here, at stage 11, as a starting point.

Repo at stage 11: [https://github.com/cerico/how-to-js-router/releases/tag/0.11.1](https://github.com/cerico/how-to-js-router/releases/tag/0.11.1)

The problem we want to solve is that our html is living in html files, outside of our bundle and we're using Fetch to retrieve them. Our aim is to replace Fetch and get them inside the js bundle, and to do this we're going to use web components.

### Pre-requisites / Previous posts

[Part One](../2017-08-26---javascript-router/)

[Part Two](../2017-09-02---js-router-part-two-refresh/)

Not really pre-requisites if we clone the repo above, but a guide to how we got to this point.

### Contents

1. Output content to page on click
2. Update routes object to use components
3. Inject Component into the DOM
4. Add a function
5. Displaying State
6. Next Steps


### 1. Create Basic HTMLElement files

```
➜  how-to-js-router git:(twelve-webc) ✗ cat src/js/components/default.js
export class DefaultComponent extends HTMLElement {

    connectedCallback() {
        console.log(DefaultComponent)
        console.log(HTMLElement)
        this.render();
    }

    render() {
        this.innerHTML = `i am the homepage`
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
     2
     3	    handleClick(){
     4	        console.log("clicked")
     5	    }
     6
     7	    connectedCallback() {
     8	        this.render();
     9	        this.addEventListener('click',this.handleClick)
    10	    }
```

Here we add a function during the connectedCallback lifecycle method. At the moment our entire Kendal 'page' is one component, and the click event applies to the whole page. 

### 5. Displaying State

```
➜  how-to-js-router git:(15.2) cat -n src/js/components/kendal.js
     1	export class KendalComponent extends HTMLElement {
     2
     3	    handleClick(){
     4	        console.log("clicked")
     5	        this.state.clicked = "yes"
     6	        this.render()
     7	    }
     8
     9	    connectedCallback() {
    10	        this.state = {}
    11	        this.state.clicked = "no"
    12	        this.render();
    13	        this.addEventListener('click',this.handleClick)
    14	    }
    15
    16	    render() {
    17	        this.innerHTML = (
    18	            `<div style="height:100px;background:orange">
    19	                <span>clicked? ${this.state.clicked}</span>
    20	            </div>`
    21	        )
    22	    }
    23	}
    24
    25	customElements.define('kendal-component', KendalComponent);
```

We're now changing page content on click. Simply displaying whether the page has been clicked or not. We make a local stage object on connectedCallback, and give clicked an attribute of no. The handleClick function changes this to yes, and rerenders the component with the new value of yes.

[https://github.com/cerico/how-to-js-router/tree/0.15.0](https://github.com/cerico/how-to-js-router/tree/0.15.0)

### 5. Next Steps / Issues

![alt text](https://dl.dropboxusercontent.com/s/6ktat8t4q9vzyah/A85D07AC-B814-4351-A712-F6D0AD9FE907-574-0000322A62D2EF7C.gif?dl=0 "")

Clicking the page turns the local state from clicked:no to clicked:yes. Great, but there is a problem. Changing pages. When we change from Kendal to Glossop and then back again, state is at clicked:no again. Our state change has been lost.

In the next piece, we will look at state management, and how to fix this.