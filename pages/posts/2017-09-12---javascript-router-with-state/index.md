---
title: Javascript Router with State
date: '2017-09-12'
layout: post
tags: 
 - ES6
 - Javascript
brief: 
 - Approaches to state management in an application with vanilla router and web components. (Js Router series part 4)
---

As we saw at the end of the previous piece, we can update content on the page with a click, but once we navigate to another page and back again our updated content is lost. 

![](https://dl.dropboxusercontent.com/s/6ktat8t4q9vzyah/A85D07AC-B814-4351-A712-F6D0AD9FE907-574-0000322A62D2EF7C.gif?dl=0 "")

In this piece we'll look at maintaining state across route changes.

[https://github.com/cerico/how-to-js-router/tree/0.15.1](https://github.com/cerico/how-to-js-router/tree/0.15.1)

### Pre-requisites / Previous posts

[Part One](../2017-08-26---javascript-router/)

[Part Two](../2017-09-02---js-router-part-two-refresh/)

[Part Three](../2017-09-11---introducing-web-components/)

Or we can just jump straight in here..

[https://github.com/cerico/how-to-js-router/tree/0.15.1](https://github.com/cerico/how-to-js-router/tree/0.15.1)

### Spoilers

1. Introduce a page counter for one component
2. Creating a store
3. Creating an action
4. Updating the store
5. Updating the component
6. Next Steps

### 1. Introduce a page counter for one component 

A clicked yes/no isn't super conducive to seeing different states, so lets change it to a classic click counter.

```
➜  how-to-js-router git:(master) cat -n src/js/components/kendal.js
     1	export class KendalComponent extends HTMLElement {
     2
     3	    handleClick(){
     4	        console.log("clicked")
     5	        this.state.counter += 1
     6	        this.render()
     7	    }
     8
     9	    connectedCallback() {
    10	        this.state = {}
    11	        this.state.counter = 0
    12	        this.render();
    13	        this.addEventListener('click',this.handleClick)
    14	    }
    15
    16	    render() {
    17	        this.innerHTML = (
    18	            `<div style="height:100px;background:orange">
    19	               <div>Page Counter = ${this.state.counter}</div>
    20	            </div>`
    21	        )
    22	    }
    23	}
    24
    25	customElements.define('kendal-component', KendalComponent)
```

Same thing happens before, we move to a different route and return, and our counter is reset back to zero.

[https://github.com/cerico/how-to-js-router/tree/0.16.0](https://github.com/cerico/how-to-js-router/tree/0.16.0)

### 2. Creating a store

First off we create a store, which will hold the state

```
➜  how-to-js-router git:(master) cat src/js/store.js
export const store =  {
    counter: 0
};
```


And we can import this into our component and set our local state to match.

```
➜  how-to-js-router git:(master) cat -n src/js/components/kendal.js
     1	import { store  } from "../store";
     2
     3	export class KendalComponent extends HTMLElement {
     4
   ...
    11	    connectedCallback() {
    12	        this.state = {}
    13	        this.state.counter = store.counter
    14	        this.render();
   ...
```

[https://github.com/cerico/how-to-js-router/tree/0.17.0](https://github.com/cerico/how-to-js-router/tree/0.17.0)

### 3. Creating an action

Now we need to update the store, rather than just the local state.

```
➜  how-to-js-router git:(16.3) cat -n src/js/components/kendal.js
     1	import { store  } from "../store";
     2
     3	export class KendalComponent extends HTMLElement {
     4
     5	    handleClick(){
     6	        console.log("clicked")
     7	        document.dispatchEvent(new CustomEvent('action', { detail: 'increaseCount' }));
     8	        this.render()
   ...
```


So, on click we create a custom event, which we can listen for elsewhere in the app, as the event is attached to the document, not the component. Lets move over to the store.

```
➜  how-to-js-router git:(master) cat src/js/store.js
export const store =  {
    counter: 0
};

document.addEventListener('action', (e) => console.log(e))
```

The custom event we send in the components handleClick function, is now picked up here in the store. We can just log it for now

![](https://dl.dropboxusercontent.com/s/y372ltmx2pbrb8b/Screen%20Shot%20on%202017-09-14%20at%2013%3A54%3A33.png?dl=0 "")

The two importan things to note here, are the type ('action'), and detail ('increaseCount').

[https://github.com/cerico/how-to-js-router/tree/0.18.0](https://github.com/cerico/how-to-js-router/tree/0.18.0)

### 4. Updating the store

```
➜  how-to-js-router git:(20.0) ✗ cat -n src/js/store.js
     1	export const store =  {
     2	  counter: 0
     3	};
     4
     5	document.addEventListener('action', (e) => {
     6	  let result = counter(store, e.detail);
     7	  console.log(result)
     8	})
     9
    10	function counter(state, action) {
    11	  console.log(state,action)
    12		switch (action) {
    13	    case 'increaseCount':
    14	      const newState = Object.assign(state, {
    15					counter: state.counter + 1
    16				});
    17				return newState
    18			default:
    19				return state;
    20	  }
    21	}
```

We've created a new counter function here, which we pass the existing store, and the action we receive from whichever custom event is created, in our case we only have one so far, 'increaseCount'.

When this function runs it creats a newState object (never modifying existing state), and returns that, which we can see logged on line 7

![](https://dl.dropboxusercontent.com/s/3i425eq67qqq823/increase.png?dl=0 "")

[https://github.com/cerico/how-to-js-router/tree/0.19.0](https://github.com/cerico/how-to-js-router/tree/0.19.0)

Now we need to return that to the component.

### 5. Updating the component

We can fire off another custom event, updating the document to say there has been a state change

```
➜  how-to-js-router git:(20.0) cat -n src/js/store.js
     1	export const store =  {
     2	  counter: 0
     3	};
     4
     5	document.addEventListener('action', (e) => {
     6	  let result = counter(store, e.detail);
     7	  document.dispatchEvent(new CustomEvent('stateChange'));
     8	})
```

And we can pick this up wherever we like, in our case the Kendal component.

```
➜  how-to-js-router git:(20.0) ✗ cat -n src/js/components/kendal.js
     1	import { store  } from "../store";
     2
     3	export class KendalComponent extends HTMLElement {
   ...
    11	    connectedCallback() {
    12	        this.render();
    13	        this.addEventListener('click',this.handleClick)
    14	        document.addEventListener('state', () => this.render());
    15	    }
```

We can now remove local state entirely, as we have access to the store

```
➜  how-to-js-router git:(master) cat -n src/js/components/kendal.js
     1	import { store  } from "../store";
     2
     3	export class KendalComponent extends HTMLElement {
   ...
    17	    render() {
    18	        this.innerHTML = (
    19	            `<div style="height:100px;background:orange">
    20	               <div>Page Counter = ${store.counter}</div>
    21	            </div>`
    22	        )
    23	    }
    24	}
```


The store is now the single point of truth for the counter. Which should mean, when we change pages and return...the counter no longer resets.

![](https://dl.dropboxusercontent.com/s/son7xslavj6sbuw/87F79E72-B232-4D87-9BFC-B05638CBB82C-574-00003FF119F42451.gif?dl=0 "")

Repo at stage 20: [https://github.com/cerico/how-to-js-router/tree/0.20.0](https://github.com/cerico/how-to-js-router/tree/0.20.0)

6. Next Steps

Next we can expand the store to encompass different counters on different pages, and showing each pages counter in the nav bar. We will also link up the vanilla state with the vanilla router, and show a log of visited pages and keep track of the active route.









