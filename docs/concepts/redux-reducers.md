## Redux Reducers

Your Redux store is the source of record for the current application state. It is a serializable authority of how to render your site.

Learning Redux is a task in and of itself. This section will be intimidating if you have no Redux knowledge. The [egghead.io Redux course](https://egghead.io/series/getting-started-with-redux) as well as the [official Redux documentation](http://redux.js.org/) are excellent resources. 

Let's see how Rook uses Redux.

### Base Redux store

A base Rook Redux store looks like this:

```
{
  routing: [The structure from react-router-redux],
  
  apiRequest: {
    loading: Boolean,
    loadError: {
      msg: String,
      stack: String
    }
  },
  
  ... your state
}
```

Both `apiRequest` and each node of your custom state is actually an Immutable.js object. 

> Note: Third party reducers are not necessarily Immutable.js capable - this is why the entirety of the store is not wrapped.

### Adding your state / reducers

The first thing you'll do when adding new state to your application is create a Redux module. This is a term we're introducing in Rook. Each module handles one object tree from the root state (shown above) and has four parts: the initial state, the reducer itself, action creators, and selectors.

To better explain these parts, we'll look at [the random.js module](https://github.com/apazzolini/rook-starter/blob/master/src%2Fredux%2Fmodules%2Frandom.js) from rook-starter.

### Initial state

```js
export const initialState = {};
```

The initial state is not very glamorous. It (optionally) contains the initial structure of your object state tree. For simplicity, you define it as a simple JS object. When Rook registers the module, it will convert it to an Immutable.js object for you.

### Reducers

```js

export const reducers = {

  'random/load': (state, action) => state,

  'random/loadOk': (state, action) => state.merge({
    ...action.result
  }),

  'random/loadFail': (state, action) => state

};
```

The bread and butter of how to manage your application state. You'll want to get familiar with the [Immutable.js map docs](https://facebook.github.io/immutable-js/docs/#/Map) as the majority of your reducer changes will use these methods.

Let's dissect the above example. The `random/load` and `random/loadFail` reducers simply return the state unchanged. Rook provides a global loading flag that is enough for rook-starter. If you'd like to track individual loading events, this might be a good place for it.

> Note: We'll cover the entirety of asynchronous data fetching in [a subsequent section](data-fetching.md).

The `random/loadOk` reducer is more interesting. We're merging in the properties that live inside of the `action.result` object. For example, if our initial state is:

```js
{}
```

and `action` is:

```js
{
  type: 'random/loadOk',
  result: {
    number: 0.73,
    time: '2016/01/01'
  }
}
```

our resulting state (**for this specific object tree**) would be: 

```js
{
  number: 0.73,
  time: '2016/01/01'
}
```

In rook-starter, the random module is mounted under the `random` node. Therefore, our global application state would be:

```js
{
  routing: ... // [The structure from react-router-redux],
  
  apiRequest: ... // [Rook's apiRequest structure],
  
  random: {
    number: 0.73,
    time: '2016/01/01'
  }
}
```

This is the entirety of the dynamic information necessary to render rook-starter.

### Action creators

Action creators are functions that return JS objects. These objects must include a `type` property. The rest is up to you. As an example, let's take a look at an action creator that *could* have been used in the above example:

```js
loadSpecificRandom: (someNumber) => ({
  type: 'random/loadOk',
  result: {
    number: someNumber,
    time: '2016/01/01'
  }
})
```

which might have been dispatched by:

```js
dispatch(loadSpecificRandom(0.73));
```

This is a contrived example to explain that each individual reducer function (like `random/loadOk`) operates independently. Rook adds a special mechanism for triggering API fetches, which we will see later. The gist of it is that dispatching an action with an `apiRequest` will trigger the initial reducer immediately, followed by `${type}Ok` or `${type}Fail` in the future.

### Selectors

You will sometimes have a need for inspecting a specific part of the state tree. This normally happens in `fetchData` methods (covered later) when you have the global state. Selectors typically look like this:

```js
export const selectors = {

  currentNumber: (globalState) => globalState.random.get('number')

};
```

> The `.get()` call here is invoking Immutable.js. Remember that `random` in the state tree is an Immutable.js object.

### Combining multiple modules

The `index.js` file in the `/src/redux/modules/` directory describes how to build the full state tree (minus the built-in Rook parts) in the default export object. When Rook loads these, each module's initial state will be converted to an Immutable.js representation.

### Dynamic initial state

You might need to set the initial Redux state dynamically during server rendering. For example, you may wish to populate a user's name or permission flags. Rook provides a hook for this. In `/src/redux/modules/index.js`, you may export a function named `updateInitialServerState`. This function should take two parameters, `request` and `initialState`, and modify the initialState as appropriate.

### Testing

Redux reducers are pure functions, which makes them super easy to test. Also, since reducers are synchronous, you test your reducer tier separately from your API tier. I grew to love this separation of concerns and think you will too.

The test is pretty self-explanatory honestly. You should just take a look at [random.test.js](https://github.com/apazzolini/rook-starter/blob/master/src%2Fredux%2F__tests__%2Frandom.test.js) from rook-starter.

## Next Steps

Learn about tying your application state to the React views [in the next section](react-views.md).