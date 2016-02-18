## Client/Server Specific Code

There are rare occassions where you might need to write code that must only run on the server or client. You might have a plugin that needs a legitimate DOM to function (like react-ace), or you may need to determine where the code is running for specific logic. Fortunately, both of these are possible.

### The `__CLIENT__` and `__SERVER__` variables

The main way to achieve the above goal is via these two global variables. They are always available in any of the code you write.

> Caveat: Neither of these variables are set for you in the testing environment. If you need to write tests for your client/server specific logic, you will need to set `global.__CLIENT__` and `global.__SERVER__` appropriately.

For example, the [random action creator](https://github.com/apazzolini/rook-starter/blob/master/src%2Fredux%2Factions%2Frandom.js) in rook-starter sets the `isOnServer` property:

```js
loadNewRandom: () => ({
  type: 'random/load',
  apiRequest: (api) => api.get(`/random`),
  isOnServer: __SERVER__
})
```

When the initial page render happens on the server, this value will be set to `true`. Subsequent reloads of the random number by dispatching this action client-side will have the value `false`.

### Webpack optimization

Webpack is awesome and will remove (some) unreachable code from your bundles. For example, if you have a block such as 

```js
if (__SERVER__) {
  ...
}
```

it will be completely stripped away from the production client bundle!
