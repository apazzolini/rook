const projectRoot = process.cwd();
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

  server: {
    // The Hapi server host
    host: process.env.HOST || 'localhost',

    // The port to use for the Hapi server
    port: process.env.PORT || 3000,

    // The port to use for the Hapi server during testing
    testPort: 4000,

    // The static resources directory (served by Hapi straight from the filesystem)
    staticPath: projectRoot + '/static'
  },

  globals: {
    // Whether or not to run redux-logger
    __LOGGER__: !isProduction,

    // Whether or not to run redux-devtools
    __DEVTOOLS__: !isProduction,

    // Should redux-devtools be visible by default on page load
    __DEVTOOLS_IS_VISIBLE__: false
  },

  // Configuration for running eslint on webpack builds
  lint: {
    enabled: false,
    config: null
  },

  // Path to custom .babelrc
  babelConfigPath: null,

  // Path to the webpack-isomorphic-tools configuration file
  toolsConfigPath: null,

  // Verbose logging
  verbose: true,

  // The react-router routes file
  routes: null,

  // The Hapi routes directory
  apiRoutes: null,

  // The Hapi extensions directory
  hapiExtensions: null,

  // The root component factory file. Optional. Will be added to Webpack aliases.
  rootComponent: null,

  html: {
    // Path to a component that provides additional DOM items for <head>
    head: null,

    // Path to a component that replaces the root HTML shell. Usage of this
    // option is discouraged as you will be responsible for configuring some 
    // internals of rook.
    root: null
  },

  redux: {
    // The redux middleware functions file
    middleware: null
  },

  webpack: {
    // An array of libraries that do not change frequently between deploys
    // and should be served in the vendor bundle.
    vendorLibraries: null,

    // Webpack configuration customizations. Please see the webpack docs.
    config: {
      // Webpack devtool configuration
      devtool: isProduction ? 'source-map' : 'inline-eval-cheap-source-map'
    }
  }
};
