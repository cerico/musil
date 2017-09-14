---
title: Javascript Router with State
date: '2017-09-12'
layout: post
tags: 
 - ES6
 - Javascript
brief: 
 - Approaches to state management in an application with vanilla router and web components. 
---

Our router is displaying static content on each route, lets look at how to incorporate state. We'll start with the repo at this point.

[https://github.com/cerico/how-to-js-router/tree/0.15.0](https://github.com/cerico/how-to-js-router/tree/0.15.0)

We have a click handler in the Glossop Component, which currently just console logs the component itself. Firstly we'll get that to update the content for that route, then switch pages and return and see if the updated content remains or not. Then we'll do the same for the other routes, ie local state for each component. Then we'll think about whether we should move each of the pages state into some kind of store that knows the state of the entire application, a single source of truth.

### Pre-requisites / Previous posts

[Part One](../2017-08-26---javascript-router/)

[Part Two](../2017-09-02---js-router-part-two-refresh/)

[Part Three](../2017-09-11---introducing-web-components/)

Or we can just jump straight in here..

[https://github.com/cerico/how-to-js-router/tree/0.15.0](https://github.com/cerico/how-to-js-router/tree/0.15.0)

### Spoilers

1. Render new content on click
2. Update routes object to use components
3. Inject Component into the DOM
4. Add a function
5. Next Steps

### 1. Render new content on click

First, We'll make the entire Kendal component a page counter.

```
export class KendalComponent extends HTMLElement {
    
    handleClick(){
        console.log("clicked")
        this.state.counter += 1
        this.render()
    }

    connectedCallback() {
        this.state = {counter:0}
        this.render();
        this.addEventListener('click',this.handleClick)
    }

    render() {
        this.innerHTML = `<div>Page Counter = ${this.state.counter}</div>`
    }
}

customElements.define('kendal-component', KendalComponent);
```

We've added local state, in the connectedCallback lifecycle method, and this updates on handleClick and re-renders. So far so good, but if we click away, to one of the other routes and then return -  the counter is back to zero. We're instantiating it back to zero every time we attach it to the DOM.


