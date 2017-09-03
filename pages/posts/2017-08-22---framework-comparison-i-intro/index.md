---
title: Framework Comparison
date: '2017-08-22'
layout: post
tags: 
  - Webpack
  - Babel
brief: Part 1 - Comparing Vanilla JS setup with React, Vue, Hyperapp
---

The purpose of this series is two fold. The first is to get more of a handle on webpack, and the second is to compare various front end frameworks, alongside vanilla JS. When I first moved over to the front end, we used Angular v1 with Gulp. Things have moved pretty fast since then, and I wanted to be able to compare various frameworks but inside the same project. In my docker series I want, eventually, to be able to compare different server side languages each running in their own container inside the same project - and it struck me that I could actually do pretty much the same for javascript, with webpack acting as a kind of glue. 

And the other thing about that is, those node-modules folders get pretty big! Keeping everything all in the same project isn't just good for easy comparison, its good for my macbook as well!

___

### Project Stucture

Lets start with an overview of the project structure

```
➜  cooper git:(master) tree -L 2 .
```
```
.
├── CHANGELOG.md
├── README.md
├── dist
├── docs
├── package-lock.json
├── package.json
├── src
│   ├── hyperapp
│   ├── index.html
│   ├── react
│   ├── vanilla
│   └── vue
└── webpack
    ├── webpack.hyperapp.config.js
    ├── webpack.react.config.js
    ├── webpack.vanilla.config.js
    └── webpack.vue.config.js
```
    
We're going to have 4 builds of the same project, react, vue, hyperapp - and vanilla JS. Each has its own webpack config and its own src directory, but they will all share the same index.html

___

### package.json


```
➜  cooper git:(master) cat package.json
```
```
{
  "name": "cooper",
  "version": "1.0.0",
  "description": "compare hyperapp, vue and react - and redux and mobx",
  "main": "index.js",
  "scripts": {
    "hyperapp": "NODE_ENV=hyperapp webpack-dev-server --host 0.0.0.0 --config webpack/webpack.hyperapp.config.js --open --env.dev",
    "vanilla": "webpack-dev-server --host 0.0.0.0 --config webpack/webpack.vanilla.config.js --open --env.dev",
    "vue": "webpack-dev-server --host 0.0.0.0 --config webpack/webpack.vue.config.js --open --env.dev",
    "react": "NODE_ENV=react webpack-dev-server --host 0.0.0.0 --config webpack/webpack.react.config.js --open --env.dev"
  },
  "devDependencies": {
    "babel-core": "^6.25.0",
    "babel-loader": "^7.1.1",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-es2015": "^6.24.1",
    "css-loader": "^0.28.4",
    "file-loader": "^0.11.2",
  },
  "dependencies": {
    "@hyperapp/router": "github:hyperapp/router",
    "d3v4": "^4.2.2",
    "hyperapp": "^0.9.3",
    "react": "^15.6.1",
    "react-dom": "^15.6.1",
    "vue": "^2.4.2",
    "vue-loader": "^13.0.2",
    "vue-resource": "^1.3.4",
    "vue-router": "^2.7.0",
    "vue-template-compiler": "^2.4.2"
  }
}
```


Each of the four builds has its own script - eg 'npm run vue', and references their webpack build. I ran into some interesting babel issues trying to run both hyperapp and react, which we'll look at shortly, but thats why we've prefaced those scripts with a NODE_ENV.

Fairly lean on the dependencies, as at this stage we're not looking to do very much, so this should be as bare bones as possible.

```
➜  cooper git:(master) cat .babelrc
```
```
{
  "env": {
    "hyperapp": {
       "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
    },
     "react": {
       "plugins": [
    ["transform-react-jsx"]
  ]
    }
  },
  "presets": [
    ["es2015", {
      "es2015": {
        "modules": false
      }
    }]
  ]
}
```

I ran into problems quite early on with babel here, with hyperapp and react both seeming to want different babel configurations for 'transform-react-jsx' to work. So i've set up different envs for each, to tie up with the package.json scripts.

___

### Next

In part II, we'll start with the webpack configuration files.


 
