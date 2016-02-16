# Rook

> Note: Rook is still beta software.

Getting started with a modern JavaScript universal application is hard. There are countless libraries, tools, and patterns to choose from. Once you've done that, you still need to figure out how to configure everything together. Only then are you able to start your real work.

Rook's goal is to solve this for you by:

- Combining React, Redux, Immutable.js, and Hapi in an ES2016 environment
- Providing patterns and structure for typical tasks, such as data fetching
- Exposing direct access to the underlying components when necessary

## Docs

Although you can read the docs directly on the GitHub repository, the generated GitBook is much easier to navigate.

You can find the docs at http://apazzolini.github.io/rook/

## Getting Started

The easiest way to learn Rook is to jump in and [get started.](http://apazzolini.github.io/rook/docs/introduction/getting-started.html) However, you should be at least a little bit familiar with the below libraries.

## Components 

Rook adds minimal functionality on top of its core components. You will be utilizing these libraries directly, and it's important to understand them. We will only briefly explain capabilities of these libraries.

### React, Redux, and friends

At its core, this project revolves around [React](https://facebook.github.io/react/).

React is the view library we are using that renders state managed by [Redux](http://redux.js.org/) on pages we arrive at through [react-router](https://github.com/rackt/react-router). Rook also brings along [redux-devtools](https://github.com/gaearon/redux-devtools) for hot reloading support.

### Hapi

[Hapi](http://hapijs.com/) is the backing Node.js server for the application. You will use Hapi for your server-side logic, and Rook will use Hapi for server-side rendering. Hapi is also responsible for serving static files, such as images.

This is a production-ready library created by Walmart to handle Black Friday traffic, and it also has a rich ecosystem. If you're not familiar with Hapi, you will also want to check out [Joi](https://github.com/hapijs/joi) and [Boom](https://github.com/hapijs/boom) for extra documentation. 

### Immutable.js

[Immutable.js](https://facebook.github.io/immutable-js/) is used to ensure your Redux reducers are, well, immutable.

### Webpack, Babel

By leveraging [Babel](https://babeljs.io/) through [Webpack](https://webpack.github.io/), we're able to use the latest and greatest ES2016 features. Hot reloading is key to a modern developer experience, and Webpack delivers.

Besides hot reloading of JS, we also hot reload CSS courtesy of PostCSS and PreCSS webpack loaders. If that wasn't sweet enough, Webpack also minifies and bundles everything together for production.

### Mocha, Chai

Testing is important. Testing can also be annoying. Rook comes preconfigured to make testing as frictionless as possible. 

## Background

Towards the end of 2015, I decided to learn React and started on a long journey through READMEs, blogs, and tutorials. After developing a basic idea of the libraries I wanted to combine, I started building my [personal website](https://azzolini.io). It's certainly over-engineered, but it was a great learning experience.

When I was nearly finished, a slew of JavaScript fatigue articles began popping up, and they're not wrong. I realized I could extract a framework out of my experience, and created Rook. This project is my attempt at simplifying modern JS dev for newcomers. 

## Acknowledgements

There are a few excellent projects in the same vein as Rook I'd like to acknowledge.

First, we have [erikras' react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example). This is certainly one of the most prominent projects combining a similar stack, and was highly used as a reference. However, I think it's a difficult starting point. There's a lot to remove to get to a clean slate, and you're left with all of the wiring pieces in your project.

Second, [bdefore's universal-redux](https://github.com/bdefore/universal-redux) has the same idea as Rook. In fact, Rook uses code from universal-redux for some configuration merging and general setup. It's a great project that abstracts away the core wiring of React/Redux. If you're looking for something more minimal and less opinionated than Rook, check it out. 

Finally, I'd like to give a shoutout to [Henry Smith](http://henrysmith.org/) for releasing the Rook package name on NPM for this project.
