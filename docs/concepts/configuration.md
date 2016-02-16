## Configuration

There are two types of configuration in a Rook project, and they're pretty simple to understand.

### Server-only configuration

These are the kinds of things you never want sent down to the client application. For example, this might consist of API tokens and other private information. This config lives in the [config/server](https://github.com/apazzolini/rook-starter/tree/master/config/server) directory.

To load server-only configuration, Rook leverages the [config package](https://github.com/lorenwest/node-config) on NPM. This provides hierarchical, environment-specific configuration along with the ability to specify environment variable replacement.

Note that the `config/local.json5` file is added to .gitignore and allows you to maintain machine-specific configuration. This is handy in a team setting and also when you don't want specific properties in your version control system.

### Client configuration

Client configuration is meant for properties the app needs to render but **are not sensitive** as the [client.js](https://github.com/apazzolini/rook-starter/blob/master/config%2Fclient.js) file is bundled in the app. You might control data such as API server paths here.