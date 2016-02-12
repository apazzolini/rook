## Rook - A 10,000' view

Rook's goal as a framework is to encapsulate away the internals of configuring a modern JavaScript universal application that utilizes ES2016 via Babel/Webpack, Hapi, React, Redux, and Immutable.js while not painting you into a corner by hiding capabilities of those tools. Rook gets you up and running with the minimum amount of boilerplate possible, production-capable configuration, and some opinionated patterns weaving everything together.

> Note: Rook is still BETA.

## Components 

Before covering what Rook adds, it's important to understand the libraries Rook brings together for you.

### Hapi

[Hapi](http://hapijs.com/) is the backing server for the application. Hapi gives you a production-ready Node.js server with minimal effort. In a Rook application, it serves:

- The `api` routes (where your server-side business logic goes)
- Static files (such as images)
- Server-rendered react-router pages (providing universal rendering support)

If you're not familiar with Hapi, you will also want to check out [Joi](https://github.com/hapijs/joi) and [Boom](https://github.com/hapijs/boom) for extra documentation. 

### React, Redux, etc

[React](https://facebook.github.io/react/) is the frontend library we are using that renders state managed by [Redux](http://redux.js.org/) on pages we arrive at through [react-router](https://github.com/rackt/react-router).

### Immutable.js

[Immutable.js](https://facebook.github.io/immutable-js/) is the library Rook uses to ensure your Redux reducers are, well, immutable.

### Webpack, Babel

By leveraging [Babel](https://babeljs.io/) through [Webpack](https://webpack.github.io/), we're able to use the latest and greatest ES2016 features. In addition to transpilation, Webpack gives us a development server with hot-reload support and takes care of bundling our scripts and stylesheets when we're ready to deploy to production. We use PostCSS with the PreCSS extension.

## Rook Opinions

In a typical application, there are a few things you'll want to do that do not have a prescribed pattern when using the above technologies. This can be cumbersome to research and manually set up, and one of this project's goals is to make those decisions for you and simply lay out a pattern for doing things such as fetching data and coordinating the response with Redux reducers and react-router transitions.

### Page-dependent data

Providing universal rendering without writing server-specific code happens via invoking react-router transitions, inspecting the components that will be present on the resulting page, gathering and invoking static `fetchData` methods from those components, and assembling the results.

The `fetchData` method on a component is executed whenever we're transitioning into a route that uses the component, both server and client side. This includes the initial render on the client. We don't want to request data we already have, so we'll typically write these methods as:

```js
import * as MyModule from '../../redux/modules/myModule';

static fetchData(getState, dispatch, location, params) {
  if (!MyModule.selectors.isThisComponentsDataLoaded(getState())) {
    return dispatch(MyModule.actions.loadSomeData());
  }
}
```

The key is to only dispatch the Redux action if the data you need for the given page for the given component is not loaded.

`fetchData` should return a Promise (which is returned from dispatch for you). Rook will prevent react-router from navigating to the destination page until that Promise is resolved.

### Data fetching

One of the few pieces of net-new functionality Rook adds is related to data fetching, and we briefly touched on it in the previous section in the dispatched action. Any Redux action creator that returns an `apiRequest` property will trigger special behavior. For example, dispatching the following action:

```js
{
  type: 'random/load',
  apiRequest: (api) => api.get(`/random`)
}
```

results in the following:

1. Rook's middleware will see that an apiRequest needs to happen
1. Rook dispatches an internal `@@rook/apiLoadingStart` action, which sets `apiLoading.loading` in the Redux state to true
1. Rook dispatches your 'random/load' action, which you handle however you'd like
1. Rook executes your api request
1. At some point in the future, the api request comes back
1. Rook dispatches an internal `@@rook/apiLoadingFinish` action, which sets `apiLoading.loading` to false.
  - If there was an error performing this request, it will also set `apiLoading.loadError` with the error
1. Rook dispatches `random/loadOk` or `random/loadFail`. These two actions are named based on convention.
  - If there was an error, the action will include an `error` field.
  - Otherwise, the action will include the response from the server in a `result` field

Typically, you might have a selector on `apiLoading.loading` with which to render a loading spinner.

### The Hapi server

To enable universal rendering without client/server specific code, the entirety of the data your application needs must come from an API. The default configuration in Rook makes it easy to rely on the Hapi server for your API (though you can certainly provide your own). In addition to wiring up your routes for you, Rook also provides you with the ability to register extensions, which enable direct configuration of the Hapi server. Typically, this is useful for configuring custom authentication and other settings Hapi provides.





