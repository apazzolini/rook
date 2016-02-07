'use strict';

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const mergeWebpack = require('webpack-config-merger');
const webpack = require('webpack');
const inspect = require('../lib/helpers/inspect');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

const projectRoot = process.cwd();
const sourceRoot = `${projectRoot}/src`;

function getUserConfig() {
  try {
    const userConfigPath = path.join(process.cwd(), './config/rook.js');
    const config = require(path.resolve(userConfigPath));
    return config;
  } catch (err) {
    console.error('No configuration file provided, using defaults.', err);
    return {};
  }
}

function getMergedBabelConfig(config) {
  function loadAndParse(filePath) {
    const file = fs.readFileSync(filePath);
    return JSON.parse(file);
  }

  let babelConfig = loadAndParse(path.resolve(__dirname, '..', './.babelrc'));

  if (config.babelConfigPath) {
    const userBabelConfig = loadAndParse(path.resolve(config.babelConfigPath));
    babelConfig = Object.assign(babelConfig, userBabelConfig);
  }

  const hmrConfig = [
    'react-transform', {
      transforms: [
        {
          transform: 'react-transform-hmr',
          imports: [ 'react' ],
          locals: [ 'module' ]
        },
        {
          transform: 'react-transform-catch-errors',
          imports: [ 'react', 'redbox-react' ]
        }
      ]
    }
  ];

  babelConfig.env.development.plugins.unshift(hmrConfig);
  babelConfig.cacheDirectory = true;

  const babelLoader = 'babel-loader?' + JSON.stringify(babelConfig);
  const jsLoaders = [ babelLoader ];

  return jsLoaders;
}

function getMergedWebpackConfig(rookConfig) {
  const isProduction = process.env.NODE_ENV === 'production';
  const webpackConfigs = require('./defaults/webpack.js');

  // Merge with base webpack config
  const webpackSubset = isProduction ? webpackConfigs.production : webpackConfigs.development;
  const baseWebpackConfig = mergeWebpack(webpackConfigs.common, webpackSubset);
  const combinedWebpackConfig = mergeWebpack(baseWebpackConfig, rookConfig.webpack.config);
  combinedWebpackConfig.context = projectRoot;
  combinedWebpackConfig.resolve.root = sourceRoot;

  // Derive webpack output destination from staticPath
  combinedWebpackConfig.output.path = rookConfig.server.staticPath + '/dist';

  // Add babel for js transpiling
  const babelConfig = getMergedBabelConfig(rookConfig);
  combinedWebpackConfig.module.loaders.unshift({ 
    test: /\.jsx?$/, exclude: /node_modules/, loaders: babelConfig 
  });
 
  // Gather tools config
  let combinedToolsConfig = require('./defaults/webpack-isomorphic-tools.js');
  if (rookConfig.toolsConfigPath !== null) {
    const userToolsConfig = require(path.resolve(rookConfig.toolsConfigPath));
    combinedToolsConfig = lodash.merge(baseToolsConfig, userToolsConfig);
  }
  
  // Don't pollute the project directory with the assets json file
  combinedToolsConfig.webpack_assets_file_path = 'node_modules/rook/webpack-assets.json';

  // Add tools settings to combined weback config
  const toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

  combinedWebpackConfig.module.loaders.push({ 
    test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' 
  });
  combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

  // Turn on linting per webpack build, unless directed not to
  if (rookConfig.lint.enabled !== false && !isProduction) {
    combinedWebpackConfig.module.loaders[0].loaders.push('eslint-loader');
    const lintConfigPath = rookConfig.lint.config || path.resolve(__dirname, '../.eslintrc');
    combinedWebpackConfig.eslint = {
      configFile: lintConfigPath
    };
  }
  
  // Add default settings that are used by server via process.env
  const definitions = {
    __LOGGER__: false,
    __DEVTOOLS__: !isProduction,
    __DEVELOPMENT__: !isProduction
  };
  
  // Override with user settings
  lodash.each(rookConfig.globals, (value, key) => { definitions[key] = JSON.stringify(value); });
  combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

  // Add routes, reducer and rootComponent aliases so that client has access to them
  combinedWebpackConfig.resolve.alias = combinedWebpackConfig.resolve.alias || {};
  combinedWebpackConfig.resolve.alias.routes = rookConfig.routes;
  if (rookConfig.redux.middleware) {
    combinedWebpackConfig.resolve.alias.middleware = rookConfig.redux.middleware;
  } else {
    combinedWebpackConfig.resolve.alias.middleware = path.resolve(__dirname, '../lib/helpers/empty.js');
  }
  if (rookConfig.rootComponent) {
    combinedWebpackConfig.resolve.alias.rootComponent = rookConfig.rootComponent;
  } else {
    combinedWebpackConfig.resolve.alias.rootComponent = path.resolve(__dirname, '../lib/helpers/rootComponent.js');
  }

  combinedWebpackConfig.resolve.alias['client-app-config'] = path.resolve(path.join(projectRoot, 'config/client.js'));

  // Add project level vendor libs
  if (rookConfig.webpack.vendorLibraries && isProduction) {
    lodash.each(rookConfig.webpack.vendorLibraries, (lib) => {
      combinedWebpackConfig.entry.vendor.push(lib);
    });
  }

  return [combinedWebpackConfig, combinedToolsConfig, babelConfig];
}

function validateConfig(config) {
  const errors = [];

  if (!config) {
    errors.push('==> ERROR: Configuration is required');
  }

  if (!config.server.port) {
    errors.push('==> ERROR: `server.port` is required');
  }

  if (!config.routes) {
    errors.push('==> ERROR: `routes` is required');
  }

  if (!config.apiRoutes) {
    errors.push('==> ERROR: `apiRoutes` is required');
  }

  if (errors.length > 0) {
    throw new Error(errors);
  }
}

function getMergedConfig() {
  const baseConfig = require('./defaults/rook.js');
  const userConfig = getUserConfig();
  const mergedConfig = lodash.merge(baseConfig, userConfig);

  const otherConfigs = getMergedWebpackConfig(mergedConfig);
  const webpackConfig = otherConfigs[0];
  const toolsConfig = otherConfigs[1];
  const babelConfig = otherConfigs[2];

  mergedConfig.webpack.config = webpackConfig;

  lodash.each(mergedConfig.globals, (value, key) => { 
    global[key] = value; 
  });

  validateConfig(mergedConfig);

  if (mergedConfig.verbose && !global.__VERBOSE_OVERRIDE__) {
    const util = require('util');
    const utilOptions = {
      depth: 12,
      colors: true
    };
    
    console.log('\nLoaded project level config');
    console.log(util.inspect(userConfig, utilOptions));

    console.log('\nBabel config:');
    console.log(util.inspect(babelConfig, utilOptions));

    console.log('\nWebpack config:');
    console.log(util.inspect(webpackConfig, utilOptions));

    console.log('\nIsomorphic tools config:');
    console.log(util.inspect(toolsConfig, utilOptions));
  }

  return mergedConfig;
}

module.exports = getMergedConfig();
