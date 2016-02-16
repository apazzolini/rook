## API Server

One of Rook's goals is supporting universal rendering without server or client specific code. To achieve this goal, all data must be loaded via the API server.

### Routes

The routes that live in `/src/api/routes/` get loaded into the API plugin in Hapi, which gets mounted at `/api`. This means that a route at `/random` would be accessible at `http://localhost:3000/api/random`.

Each file in this directory must export an array under the `routes` property. The object members of this array must conform to the following specification:

```
{
  path: String - the route path
  method: String - the HTTP request method
  handler: Function - the route handler
  auth: String - [Optional] shortcut to config.auth
  query: Joi Object - [Optional] shortcut to config.validate.query
  params: Joi Object - [Optional] shortcut to config.validate.params
  payload: Joi Object - [Optional] shortcut to config.validate.payload
  config: Object - [Optional] has precedence above shortcuts on conflicts
}
```

For an example, take a look at [random.js](https://github.com/apazzolini/rook-starter/blob/master/src/api/routes/random.js) in the starter project.

### Hapi Extensions

It is likely that you will need to configure Hapi in specific ways for your application. For example, you may want to wire up an authentication module, such as [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie). The way to achieve this in Rook is by using a Hapi extension.

The files inside of the `/src/api/extensions/` directory should each define a default exported function. During server startup, Rook will invoke each of these with two arguments, `server` and `projectConfig`. The first object is the Hapi server object, and the second is the Rook configuration.

For an example, take a look at [auth.js](https://github.com/apazzolini/rook-starter/blob/master/src/api/extensions/auth.js) in the starter project.

### Testing

Hapi is incredibly easy to test as it comes with an `inject()` method that allows you to simulate a network request. As the API tier controls your data, it is one of the most important aspects of the application to test.

The best way to learn is to dive right in. Check out [random.test.js](https://github.com/apazzolini/rook-starter/blob/master/src%2Fapi%2F__tests__%2Frandom.test.js) in the starter project for more details.

## Next Steps

You are now capable of creating your entire API tier, and testing it. The next step is to create your [Redux reducers](redux-reducers.md) for managing application state.