## Project Structure

A Rook application has several moving components. We'll start with an overview of the code structure and then go in-depth.

### [API server](/docs/concepts/api-server.md) (`/src/api/`)

- `routes/`: The "main" directory. Each file that lives in this directory will be loaded by Rook into Hapi 
- `extensions/`: These files provide a callback to allow full customization of Hapi

### [Redux reducers](/docs/concepts/redux-reducers.md) (`/src/redux/`)

- `modules/index.js`: This file aggregates your other reducers and provides a hook point for setting initial state
- `modules/`: The other files inside of this directory hold your Redux reducers

### [React views](/docs/concepts/react-views.md) (`/src/views/`)

- `_app/App.js`: Your application and meta-information shell
- `_app/Head.js`: Customizations to the `<head>` section
- `routes.js`: Your [react-router](https://github.com/rackt/react-router) route definition
- `**/*`: Other files you need to render your views

### [Configuration](/docs/concepts/configuration.md) (`/config/`)

- `server/`: Server-only configuration loaded by [config](https://github.com/lorenwest/node-config).
- `server/local.json5`: Added to .gitignore, holds machine-specific configuration
- `client.js`: Used to render the React application. These values are used both server and client-side for app rendering. Do **not** store credentials in this file.
- `rook.js`: Controls certain Rook behavior.

## Next Steps

Let's dive into each of these sections for a better understanding, starting with [the API server](/docs/concepts/api-server.md).