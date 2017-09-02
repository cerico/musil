---
title: Framework Comparison
date: '2017-08-23'
layout: post
tags: 
  - Webpack
  - Javascript
brief: Part 2 Using webpack configuration to build React, Vue, Hyperapp and Vanilla JS within the same application.
---

Our comparison app is going to have four builds, each with its own webpack confg, so we'll move the various webpack files into their own directory.

```
➜  cooper git:(master) tree webpack
```
```
webpack
├── webpack.hyperapp.config.js
├── webpack.react.config.js
├── webpack.vanilla.config.js
└── webpack.vue.config.js

0 directories, 4 files
```

HTML
---

```
➜  cooper git:(master) cat src/index.html
```
```
<html>
  <head>
    <title>mini-compare out</title>
  </head>

  <body>
    <div id="main" class="main"/>
     <script src="./bundle.js"></script>
  </body>
</html>
```

Straightforward index file, webpack will build each version into a bundle.js, referenced here. Let's start with our vanilla config.

Initial Webpack Configs

```
➜  cooper git:(master) cat webpack/webpack.vanilla.config.js
```
```
module.exports = options => {
  return {
    entry: './src/vanilla/index.js',
    output: {
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    devServer: {
       port: 2008,
        historyApiFallback: {
          index: 'src/index.html',
      },
    },
  }
}
```


* The entry point in this case is going to be the index file of the vanilla directory. This is what will be bundled by webpack.
* Output will be bundles.js, which is what the html will look for.
* devtool 'source-map' allows us to see which file and line logs and errors appear, rather than in their position in the bundled js file, easier for troubleshooting
* devServer - We'll serve this build on port 2008, and have src/index.html as our fallback page. Single Page Applications need a root point, in case the user refreshes or tries to access a page directly, meanin the web server would bypass the index file and attempt to load a page that doesn't exist.


React
---

```
➜  cooper git:(master) cat webpack/webpack.react.config.js
```
```
module.exports = options => {
  return {
    entry: './src/react/index.js',
    output: {
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    devServer: {
      port: 2009,
       historyApiFallback: {
        index: 'src/index.html',
      },
    },
    module: {
      rules: [{
        loader: 'babel-loader',
      }],
    },
  }
}
```

Almost identical to the vanilla webpack, other than using a different entrypoint, and serving on a different port (2009). We also need babel-loader, for react presets. We should also look again at the .babelrc

```
➜  cooper git:(master) ✗ cat .babelrc
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

We can reference the plugins either in webpack itself, or by using this .babelrc file. I'm undecided which is best, but for this project I want to keep the webpack files as similar as possible for comparisons, and keep babel out of it as much as possible to keep things a bit clearer.

```
➜  cooper git:(master) cat webpack/webpack.hyperapp.config.js
```
```
module.exports = options => {
  return {
    entry: './src/hyperapp/index.js',
    output: {
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    devServer: {
      port: 2002,
       historyApiFallback: {
        index: 'src/index.html',
      },
    },
    module: {
      rules: [{
        loader: 'babel-loader',
      }],
    },
  }
}
```

Hyperapp is actually identical to react here, the only differences being in the .babelrc

```
➜  cooper git:(master) cat webpack/webpack.vue.config.js
```
```
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = options => {
  return {
    entry: './src/vue/index.js',
    output: {
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
         '@': resolve('src')
        }
    },
    devtool: 'source-map',
    devServer: {
      port: 2003,
      historyApiFallback: {
        index: 'src/index.html',
      },
    },
    module: {
      rules: [{
        loader: 'babel-loader',
      },{
        test: /\.vue$/,
        loader: 'vue-loader',
      }],
    },
  }
}
```

Vue's webpack is a little more involved, we have an extra loader statement for .vue files, and we have the resolve alias section, which we'll look at in more detail when we come to view

Next
---

Next up we'll look at the source files for each version.
