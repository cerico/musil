---
title: Connecting Router With Store
date: '2017-09-14'
layout: post
tags: 
 - ES6
 - Javascript
brief: 
 - Connecting a vanilla JS router with a redux-style vanilla JS store. (Js Router series part 5)
---

In the last post we moved local state to a store object, and were able to move from page to page without losing our pages state (a simple counter). But this gives us other things to think about. Perhaps we'd like to show which link is active, or do other things based on which view we're on. Our router and our store are independent of each other, so now we'll look at how to link them.

We can pick the repo up at stage 20: [https://github.com/cerico/how-to-js-router/tree/0.20.0](https://github.com/cerico/how-to-js-router/tree/0.20.0)

### Previously in 'How To JS Router'

[Part One](../2017-08-26---javascript-router/)

[Part Two](../2017-09-02---js-router-part-two-refresh/)

[Part Three](../2017-09-11---introducing-web-components/)

[Part Four](../2017-09-12---javascript-router-with-state/)

### Spoilers

1. Refactoring Index and Header Page
2. Connect Router to Store Dispatch
3. Dispatch Action (store)
4. Subscribe Router to Store
5. Multiple Subscribers
6. Showing the active link
7. Expanding Store
8. Issues
9. Comparing state with previousState
10. Should Update?
11. Unsubscribing
12. Return of pushState and backbutton
13. Build for production
14. Next steps



### 1. Refactored Index and Header Page

First lets tidy up the index page

```
import {store} from './store';
import { Delph } from './Delph';
import { Header } from './components/header'
import { Footer } from './components/footer'
import { routes } from './routes'


export class Index {

    constructor(){
      let path = window.location.pathname.substr(1)
      let config = {
          routes:routes,
          store:store,
          path: path
        }
      new Header(config)
      new Delph(config)
    }
  };
  document.addEventListener('DOMContentLoaded', () => {
    new Index()
  })
  ```
  

More or less the same, but we pass the Delph router a config object, comprising of the routes, state and current page. The header page is initiated at the same time and passed the same config object.

```
➜  how-to-js-router git:(21-refactoring-index) cat src/js/components/header.js
import { ListItem } from './list-item'

export class Header  {

  constructor(config){
    this.routes = config.routes
    this.store = config.store
    let header = document.createElement('ul')
    document.body.appendChild(header)
    this.render()
  }

  render(){
    Object.keys(this.routes).map(route => {
      let link = new ListItem(route,this.store)
      header.appendChild(link);
    })
  }
}
```


As we have multiple link items, we'll make each its own webcomponent

```
➜  how-to-js-router git:(21-refactoring-index) cat src/js/components/list-item.js
export class ListItem extends HTMLElement {

    constructor(route,store){
        super()
        this.route = {
            text: route || 'index',
            path: route
        }
        this.store = store
    }

    handleClick(){

    }

    connectedCallback() {
        this.addEventListener('click',this.handleClick)
        this.render()
    }

    render(previousState,state) {
          this.innerHTML = (`<li>${this.route.text}</liv>`)
    }
}

customElements.define('list-item', ListItem)
```

Repo at stage 21: [https://github.com/cerico/how-to-js-router/tree/0.21.0](https://github.com/cerico/how-to-js-router/tree/0.21.0)

### 2. Dispatching a route change

Instead of loading a route directly, we'll move the loadRoute function out to an actions file - and then we'll have the store run that action. As we'll see this means different parts of the app can be notified on route change and run whichever functions they need to at that point.

```
➜  how-to-js-router git:(21.7) ✗ cat src/js/delph.js
import { loadRoute } from './actions'

export class Delph {

  constructor(config){
    this.routes = config.routes;
    this.routerOutlet = document.createElement('div')
    document.body.appendChild(this.routerOutlet)
    config.store.dispatch(loadRoute({path:config.path}))
  }

  render(){

  }
}
```


```
➜  how-to-js-router git:(21.7) ✗ cat src/js/actions.js
export function loadRoute (route){
    return {
        type: 'CHANGE_ROUTE',
        route
    }
}
```


The route object here will be {path:config.path}). But its the store's dispatch action which runs this, so lets take a look there. To start off, we'll configure our store as if it is only ever going to run this one function.

### 3 Dispatch Action (store)

```
➜  how-to-js-router git:(21.7) ✗ cat src/js/store.js
function Store ()  {
  this.state = {route: null}
};

let routeChanger

Store.prototype.dispatch = function(action){
  console.log(action)
  console.log(this.state)
  this.state.route = changeRoute(this.state.route,action)
  console.log(this.state)
}

function changeRoute(route,action){
  switch (action.type){
      case 'CHANGE_ROUTE':
          let newRoute = action.route
          return newRoute
      default:
          return route || ''

  }
}

export const store = new Store()
```



We initiate the store with an empty state. When the dispatch function runs, it runs any functions that need to update the state, of which we only have one right now 'changeRoute'. We run this with the current state and the action function referenced from our router, which should return {path:config.path}). Because the action types ('CHANGE_ROUTE') match, it will create a new route object and return that. And if we look in the logs we can see we have a new route as part of our state.

But now what, the store is updated but nothing has happened, how do we let our router or any other part of the app know that something has changed and it should do something?

### 4. Subscribe Router to Store

Firstly, we need to have our router subscribe to the store, so that it can be notified when a change has happened

```
➜  how-to-js-router git:(22-dispatch-route) ✗ cat src/js/delph.js
import { loadRoute } from './actions'

export class Delph {

  constructor(config){
    this.routes = config.routes;
    this.routerOutlet = document.createElement('div')
    document.body.appendChild(this.routerOutlet)
    config.store.subscribe(this.render.bind(this));
    config.store.dispatch(loadRoute({path:config.path}))
  }

  render(page){
    while (this.routerOutlet.firstChild) {
      this.routerOutlet.removeChild(this.routerOutlet.firstChild);
    }
    this.routerOutlet.appendChild(new this.routes[page.path])
  }
}
```

Just as we sent the store's dispatch a function, we can do the same to the store's subscribe function. We'll send it the router's render function, so this will run whenever the store notifies its subscribers (us!) that they need to run.

```
➜  how-to-js-router git:(21.81) ✗ cat -n src/js/store.js
   ...
     5	let routeChanger
     6
     7	Store.prototype.subscribe = function(fn){
     8	  console.log(fn)
     9	  routeChanger = fn
    10	}
    11
    12	Store.prototype.dispatch = function(action){
    13	  this.state.route = changeRoute(this.state.route,action)
    14	  routeChanger(this.state)
    15	}
```


We've made a function routeChanger when we instantiated the store, and when the router subscribes - and sends its render function, we make that become our routeChanger function. Then we can run this as part of the dispatch function - which means the router will then run its render function, with the new state.

Repo at stage 22: [https://github.com/cerico/how-to-js-router/tree/0.22.0](https://github.com/cerico/how-to-js-router/tree/0.22.0)

### 5. Multiple Subscribers

Lets return to the link items in the header.

```
➜  how-to-js-router git:(23-header-subscriber) ✗ cat -n src/js/components/list-item.js
     1	import { loadRoute } from '../actions'
   ...
    14	  handleClick(){
    15	    this.store.dispatch(loadRoute({path:this.route.path}))
    16	  }
    17
    18	  connectedCallback() {
    19	    this.store.subscribe(this.render.bind(this));
    20	    this.addEventListener('click',this.handleClick)
    21	    this.render()
    22	  }
    23
    24	  render() {
    25	    console.log('am i rendering?')
    26	    this.innerHTML = (`<li>${this.route.text}</liv>`)
    27	  }
    28	}
    29
    30	customElements.define('list-item', ListItem)
```

Now we've added subscriber and dispatcher capability to the link items, but there is a problem!
    
The router and the header both subscribe to the store with the functions they want run, one overwriting the other - as we only have one function set.. Lets push our subscriber functions into an array, so we can run each of them instead of only one.

```
➜  how-to-js-router git:(dev) ✗ cat -n src/js/store.js
   ...
     5	let subscribers = []
     6
     7	Store.prototype.subscribe = function(fn){
     8	  subscribers.push(fn)
     9	}
    10
    11	Store.prototype.dispatch = function(action){
    12	  this.state.route = changeRoute(this.state.route,action)
    13	  subscribers.forEach(subscriber => subscriber(this.state))
    14	}
```



Now both the render function of the router and the render function of each link item will run whenever the store is updated. Note that we're now passing each subscriber function the whole state - as now there will be more than one, they may require access to different parts of the state.

We'll also need to reflect that change in the router

```
➜  how-to-js-router git:(dev) ✗ cat -n src/js/delph.js
   ...
    17	    this.routerOutlet.appendChild(new this.routes[page.route.path])
   ...
```

Repo at stage 23: [https://github.com/cerico/how-to-js-router/tree/0.23.0](https://github.com/cerico/how-to-js-router/tree/0.23.0)

### 6. Showing the active link

Ok, but so what? How is this helping? Well, now that both the router and the link items are subscribed to the store, both can be updated and we can not only show the correct page but also which link is the active link. Both render functions are run as they are both subscribed.

```
➜  how-to-js-router git:(dev) ✗ cat -n src/js/components/list-item.js
   ...
    25	    render(store) {
    26	        let linkColour
    27	        this.route.path === this.store.state.route.path ?
    28	          linkColour = "color:red" :
    29	          linkColour = "color:blue"
    30	        this.innerHTML = (`<li style=${linkColour}>${this.route.text}</liv>`)
    31	    }
   ...
```

Repo at stage 24: [https://github.com/cerico/how-to-js-router/tree/0.24.0](https://github.com/cerico/how-to-js-router/tree/0.24.0)

### 7. Expanding the store

Lets add our counter back in to the Kendal page, and put a timeout on the page's render function, so we can see more clearly whats happening.

```
➜  how-to-js-router git:(timeout) ✗ cat -n src/js/actions.js
   ...
     9	export function increaseKendal (count){
    10	    return {
    11	        type: 'INCREASE_KENDAL',
    12	        count
    13	    }
    14	}
```


```
➜  how-to-js-router git:(timeout) ✗ cat -n src/js/store.js
   ...
    15	Store.prototype.dispatch = function(action){
    16	  this.state = {
    17	    route: changeRoute(this.state.route,action),
    18	    kendal: kendalCount(this.state.kendal,action)
    19	  }
   ...
    35	function kendalCount(kendal,action){
    36	  switch (action.type){
    37	      case 'INCREASE_KENDAL':
    38	          let newState = {counter: kendal.counter + 1}
    39	          return newState
    40	      default:
    41	          return kendal || {counter: 0}
    42	  }
    43	}
    44
    45	export const store = new Store()
```

```
how-to-js-router git:(timeout) ✗ cat src/js/components/kendal.js
import { store  } from "../store";
import { increaseKendal } from '../actions'

export class KendalComponent extends HTMLElement {

  constructor(){
    super()
    this.store = store       
  }
    
  handleClick(){
    this.store.dispatch(increaseKendal(1))
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click',this.handleClick);        
  }

  render() {
    this.innerHTML = (
      `<div style="height:100px;background:orange">
        <div>Page Counter = ${this.store.state.kendal.counter}</div>
      </div>`
    )
  }
}

customElements.define('kendal-component', KendalComponent);
```


Now the store has two responsibilities, handling the router and now also the counter for the kendal page. We have a dispatch action (increaseKendal) to increase the counter. Lets put a timeout on our router so we can see more clearly what happens.

```
➜  how-to-js-router git:(timeout) ✗ cat -n src/js/delph.js
   ...
    17	    setTimeout (() => {
    18	      this.routerOutlet.appendChild(new this.routes[page.route.path])
    19	    },500)
   ...
```

Repo at stage 25: [https://github.com/cerico/how-to-js-router/tree/0.25.0](https://github.com/cerico/how-to-js-router/tree/0.25.0)

### 8. issues

![with timeout](https://s3.amazonaws.com/how-to-js-router/Screen+Capture+on+2017-10-01+at+14-32-43.gif "with timeout")


Looks ok at first glance, but theres a big issue here. When we click the page to increase the counter, the router is re-rendering the entire kendal element. This also means the counter is incrementing, even if we dont have the kendal componenets render method subscribed to the store, because its literally rerendering the whole element via the router.

So whats happening? What we're doing here is blindly rerendering everything, regardless of whether it needs to be rerendered. When we click on the counter to increment, we'd like the number to go up - but we don't want to re-render the whole view. So we need to be more selective about what we're going to re-render. To do this, instead of passing the store's state everywhere, we'll create a previousState object. Then we can pass both the state and the previousState to each subscriber function, and let them do a comparison and decide what to render.

### 9. Comparing state with previousState

```
➜  how-to-js-router git:(27-previousState) ✗ cat -n src/js/store.js
     1	function Store ()  {
     2	  this.previousState = {}
     3	  this.state = {}
     4	};
   ...
    16	Store.prototype.dispatch = function(action){
    17	  this.previousState =  { ...this.state }
    18	  this.state = {
    19	    route: changeRoute(this.state.route,action),
    20	    kendal: kendalCount(this.state.kendal,action)
    21	  }
    23	  subscribers.forEach(subscriber => subscriber(this.state))
    24	}
   ...
```

First we create a previousState object, and secondly everytime the store dispatches its action, we take a copy of the current state to compare against. For this we're using an object spread, as we want a deep copy not just a pointer to the state.

For this to work we currently need babel installed.

```
➜  how-to-js-router git:(27-previousState) ✗ npm install --save-dev babel-preset-stage-2 babel-loader babel-core
```

and supplied to webpack.

```
➜  how-to-js-router git:(27-previousState) ✗ cat -n webpack/webpack.config.js
     1	module.exports = options => {
     2	  return {
   ...
    18	    module: {
    19	      loaders: [
    20	        {
    21	          test: /\.jsx?$/,
    22	          exclude: /node_modules/,
    23	          loader: 'babel-loader',
    24	          query: {
    25	            presets:[ 'stage-2' ]
    26	          }
    27	        }
    28	      ]
    29	    }
    30	  }
    31	}
    32
```

Repo at stage 26: [https://github.com/cerico/how-to-js-router/tree/0.26.0](https://github.com/cerico/how-to-js-router/tree/0.26.0)

What this now means, is we can send each subscriber function both previous and current state

```
➜  how-to-js-router git:(28-comparingStates) cat -n src/js/store.js
   ...
    16	Store.prototype.dispatch = function(action){
    17	  this.previousState =  { ...this.state }
    18	  this.state = {
    19	    route: changeRoute(this.state.route,action),
    20	    kendal: kendalCount(this.state.kendal,action)
    21	  }
    22	  subscribers.forEach(subscriber => subscriber(this.previousState,this.state))
    23	}
```

So everywhere now, each subscribers render function can assess whether it needs to update

```
➜  how-to-js-router git:(28-comparingStates) cat -n src/js/delph.js
   ...
    13	  render(previousState,state){
    14	    if (previousState.route.path != state.route.path ){
   ... 
```

```
➜  how-to-js-router git:(28-comparingStates) cat -n src/js/components/kendal.js
   ...
    21	  render(previousState,state) {
    22	    if (previousState.kendal.counter != state.kendal.counter){
   ...
```

Repo at stage 27: [https://github.com/cerico/how-to-js-router/tree/0.27.0](https://github.com/cerico/how-to-js-router/tree/0.27.0)

### 10. Should update?

Lets stop for a second here and look at the Kendal Component again

```
➜  how-to-js-router git:(29-shouldUpdate) cat -n src/js/components/kendal.js
   ...
     6	  constructor(){
     7	    super()
     8	    this.store = store
     9	    this.store.subscribe(this.render.bind(this))
    10	  }
   ...
    16	  connectedCallback() {
    17	    this.render();
    18	    this.addEventListener('click',this.handleClick);
    19	  }
```


We have two ways of rendering the view, an initial render in the connectedCallback, for whenever we arrive at this page. And we've setup the subscriber function as well. Now this is fine in this particular case, as every time we increment we want that reflected. But what if our action here didn't contain anything that should automatically trigger a re-render? In that case we could subscribe a shouldUpdate function to the store, instead of the render method and let it handle whether to render or not.

```
➜  how-to-js-router git:(29-shouldUpdate) ✗ cat -n src/js/components/kendal.js
   ...
     6	  constructor(){
     7	    super()
     8	    this.store = store
     9	    this.store.subscribe(this.shouldUpdate.bind(this))
    10	  }
    11
    12	  handleClick(){
    13	    this.store.dispatch(increaseKendal(1))
    14	  }
    15
    16	  connectedCallback() {
    17	    this.render();
    18	    this.addEventListener('click',this.handleClick);
    19	  }
    20
    21	  shouldUpdate(){
    22	    if (this.store.previousState.kendal.counter != this.store.state.kendal.counter){
    23	      this.render()
    24	    }
    25	  }
```

Now the render method just runs, and the decision making on whether to run it is moved away completely, either to the router if we're coming from another page, or the shouldUpdate function, if we're already on the page and updating it

Repo at stage 28: [https://github.com/cerico/how-to-js-router/tree/0.28.0](https://github.com/cerico/how-to-js-router/tree/0.28.0)

### 11. Unsubscribing

If we log in our render function, we now see we have a new problem.


that render function is spiralling out of control, re-rendering far too many times. Whats going on? Well, each time we come to this page we're adding the a subscriber function, we go to the Glossop page and then come back...and we add it again. and again and again. So we need to be able to remove functions from the subscriber array when we leave a page - and for that we'll use the disconnectedCallback method - and attach that to an unsubscribe method in the store

```
➜  how-to-js-router git:(30-unsubscribe) ✗ cat -n src/js/store.js
   ...
    14	Store.prototype.unsubscribe = function(fn){
    15	  console.log(fn)
    16	}
   ...
```


```
➜  how-to-js-router git:(30-unsubscribe) ✗ cat -n src/js/components/kendal.js
   ...
    21	  disconnectedCallback() {
    22	    this.store.unsubscribe("?")
    23	  }
   ...
```


We can send the function to be unsubscribed but we should reference it first in the constructor, so we have something digestable to send to the unsubscribe function.

```
➜  how-to-js-router git:(30-unsubscribe) cat -n src/js/components/kendal.js
   ...
     6	  constructor(){
     7	    super()
     8	    this.store = store
     9	    this.subscriber = this.shouldUpdate.bind(this)
    10	    this.store.subscribe(this.subscriber)
    11	  }
   ...
    22	  disconnectedCallback() {
    23	    this.store.unsubscribe(this.subscriber)
    24	  }
   ...
```

And now we can remove this from the subscribers array in the store.

```
➜  how-to-js-router git:(30-unsubscribe) cat -n src/js/store.js
   ...
    14	Store.prototype.unsubscribe = function(fn){
    15	  subscribers.splice(subscribers.indexOf(fn), 1);
    16	}
```

Now we shouldn't run into issues with duplicate subscribers and rendering

Repo at stage 29: [https://github.com/cerico/how-to-js-router/tree/0.29.0](https://github.com/cerico/how-to-js-router/tree/0.29.0)

### 12. Return of pushState and backbutton

One thing you will have noticed, is our url isn't changing anymore, and our back button doesn't work. We'll need to reintroduce these into our refactored router. Lets do that now.

```
➜  how-to-js-router git:(31-back) cat -n src/js/delph.js
   ...
    13	  render(previousState,state){
    14	    if (previousState.route.path != state.route.path ){
    15	      let page = state.route.path
    16	      let back = state.route.back
    17	      while (this.routerOutlet.firstChild) {
    18	        this.routerOutlet.removeChild(this.routerOutlet.firstChild);
    19	      }
    20	      if (!back){
    21	        history.pushState({ page}, null, `/${page}`);
    22	      }
   ...
```


We can add a 'back' to our route object, and if its not present we can push the page into the history object, and update the url. Now we need to re-add the back button functionality

```
    // src/js/delph.js
     1	import { loadRoute } from './actions'
     2
     3	export class Delph {
     4
     5	  constructor(config){
   ...
    11	    this.handleBackButton(config.store)
    12	  }
    13
    14	  handleBackButton = (store) => {
    15
    16	    window.onpopstate = (event) => {
    17	      let content = "";
    18	      if (event.state) {
    19	        content = event.state.page;
    20	        store.dispatch(loadRoute({path:content,back:true}))
    21	      }
    22	    }
    23	  }
   ...
```

We can pass the store to the handleBackButton function, and if the event state is present, we can pass that to the store's dispatch action, along with a back true to signify the back button was used.

Repo at stage 30: [https://github.com/cerico/how-to-js-router/tree/0.30.0](https://github.com/cerico/how-to-js-router/tree/0.30.0)

### 13. Build for production

We'll need to add to our production webpack config, for the babel loaders we used earlier

```
➜  how-to-js-router git:(master) cat webpack/webpack.prod.config.js
const path = require('path')

module.exports = options => {
  return {
    entry: './src/js/index.js',
    output: {
      path: path.join(__dirname, '../', '/dist'),
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets:[ 'stage-2' ]
          }
        }
      ]
    }
  }
}
```


Repo at stage 31: [https://github.com/cerico/how-to-js-router/tree/0.31.0](https://github.com/cerico/how-to-js-router/tree/0.31.0)

### 14. Next steps

In Part 6 we'll look at nested routes





`