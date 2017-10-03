---
title: Handling Nested Routes with vanilla JS router
date: '2017-10-01'
layout: post
tags: 
 - ES6
 - Javascript
brief: Refactoring JS router to handle nested routes (Js Router series part 6)
---

In the last post we got our router working with our store but are only able to handle routes that are one level deep. In order to handle nested routes (eg /glossop/nested/5 we'll have to refactor our router. Thankfully this will be a much shorter post than the last one!

We can pick the repo up at stage 31: [https://github.com/cerico/how-to-js-router/tree/0.31.0](https://github.com/cerico/how-to-js-router/tree/0.31.0)

### Previously in 'How To JS Router'

[Part One](../2017-08-26---javascript-router/)

[Part Two](../2017-09-02---js-router-part-two-refresh/)

[Part Three](../2017-09-11---introducing-web-components/)

[Part Four](../2017-09-12---javascript-router-with-state/)

[Part Five](../2017-09-14---connecting-router-with-state/)

### Contents

1. index.html
2. routes.js
3. delph.js
4. Next steps

### 1. index.html

Only one thing we need to here, just add one line to the index.html file


```
➜  how-to-js-router git:(nestedRoutes) ✗ cat src/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Index</title>
    <base href="/" />
    <style>
      html { height: 100% }
      body {
        border: 2px solid  cornflowerblue;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <ul id='header'></ul>
    <div id='main'></div>

    <script src='./bundle.js'></script>
  </body>
</html>
```

We need to add ```<base href="/" />```. When we only had routes one level deep we didn't need this, as we were never traversing more than one level away from / anyway. Once we add a second level, eg glossop/new, the 'base' for the content becomes glossop, but that isn't where our content actually is.

### 2. routes.js

```
➜  how-to-js-router git:(nestedRoutes) ✗ cat src/js/routes.js
import { GlossopComponent } from './components/glossop'
import { KendalComponent } from './components/kendal'
import { DefaultComponent } from './components/default'

export const routes = [
    {title:'glossop', path: 'glossop/nested', component:GlossopComponent},
    {title: 'kendal', path: 'kendal/refactored', component: KendalComponent},
    {title: 'index', path: '', component: DefaultComponent}
]
```

As our pathname may now be more than one level deep, its most likely going to be different from the title we might want to display in eg our nav bar. So it makes sense here to split our route out into an object, and separate the title from the path.

### 3. delph.js

This means we'll need to refactor the router's render method, as we now have an array of route objects, rather than a single route object with different key/value pairs.

```
➜  how-to-js-router git:(nestedRoutes) ✗ cat src/js/delph.js
...

  render(previousState,state){
    if (previousState.route.path != state.route.path ){
      let page = state.route.path
      let back = state.route.back
      let route = this.routes.find((route) => route.path === page)
      while (this.routerOutlet.firstChild) {
        this.routerOutlet.removeChild(this.routerOutlet.firstChild);
      }
      if (!back){
        history.pushState({ page}, null, `/${page}`);
      }
      this.routerOutlet.appendChild(new route.component)
    }
  }
}
```

Only two changes, firstly we select the correct route with an Array.find. And secondly we want to initiate the component part of the route object

Repo up at stage 32: [https://github.com/cerico/how-to-js-router/tree/0.32.0](https://github.com/cerico/how-to-js-router/tree/0.32.0)

![nested routes](https://s3.amazonaws.com/how-to-js-router/nestedroutes.gif "nested routes")


### 4. Next steps

In part 7 we can move onto multiple hierarchical components per page

