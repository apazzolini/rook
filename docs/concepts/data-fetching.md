## Data Fetching

This is one of the trickiest parts of a universal React/Redux application. It requires wiring the API server together with React, Redux, and react-router. Rook takes care of the heavy lifting here - you only need to declare your data dependencies and how they alter the state.

### Performing an API request

You will always perform API requests  when dispatching Redux actions. They will be triggered whenever an action with an `apiRequest` property is dispatched. For example, let's look at the `loadNewRandom` action creator:

```js
loadNewRandom: () => ({
  type: 'random/load',
  apiRequest: (api) => api.get(`/random`),
  isOnServer: __SERVER__
})
```

The `apiRequest` is a function that receives an ApiClient object and then performs an operation on that object. ApiClient allows you to call the various HTTP methods (get, post, delete, put, patch) on the API server. These methods are backed by [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch).

- `get` and `delete` only take a path
- `post`, `put`, and `patch` take a path and an object to send
- `performFetch` takes a path and an options object
  - This is a direct passthrough to the isomorphic-fetch `fetch` method.

### Handling the results

You've made an API request. Now you need to handle it. Rook provides a convention based method of calling your reducers.

For the above request, `random/load` was the initial dispatched type. Once the Rook middleware intercepts this event, it will forward the `random/load` event through to the reducer.

At some point in the future, the network request will complete. Now, one of two things will happen:

- The request was successful: `random/loadOk` will be dispatched, with the response from the server available in the action under `result`.
- The request was not successful: `random/loadFail` will be dispatched, with the error available in the action under `error`.

Note that the convention is to create reducers with the same name followed by `Ok` or `Fail`. This keeps your boilerplate down.

### Internal Rook loading flags

In addition to dispatching the above actions, Rook will set a couple of objects on the Redux store to help you track current requests. Specifically:

```js
{
  apiRequest: {
    loading: Boolean
    loadError: {
      msg: String,
      stack: String
    }
  }
}
```

These are handy for global loading notifications.

### Visual description

The data loading flow is complicated. This chart may help you understand better:

![](data-flow.png)

### Page-dependent data

The final part of our data fetching discussion is delaying page renders until data is available. This is done to support server-side rendering and ensure proper client-side component rendering.

It's achieved with a static `fetchData` method defined in your React components. Let's take a look:

```js
static fetchData(getState, dispatch, location, params) {
  // Require a random number to be generated before rendering this component
  if (!getState().random.get('number')) {
    return dispatch(Actions.random.loadNewRandom());
  }
}
```

`fetchData` should return a Promise object. You can create these yourself (if aggregating multiple API calls) or you can return the one created from dispatch. In the above example, the following happens:

1. A page transition is requested
2. Rook finds all React components that the given page will need
3. Rook aggregates the `fetchData` methods in the components
4. It invokes the `fetchData` methods. Typically, these methods will dispatch actions that have an `apiRequest` property.
5. Once all the data is loaded, Rook allows react-router to continue its transition

## Next Steps

You're almost done! The last section is [configuration](configuration.md), an important component of any application. Learn how Rook handles your client and server configs in the next section.
