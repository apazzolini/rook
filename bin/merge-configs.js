#!/usr/bin/env node
const path = require('path');
const util = require('util');
const lodash = require('lodash');
const webpack = require('webpack');
const mergeWebpack = require('webpack-config-merger');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');

const mergeBabel = require('./merge-babel-config');
const baseConfig = require('../config/rook.js');
const webpackConfigs = require('../config/webpack.js');
const baseToolsConfig = require('../config/webpack-isomorphic-tools.js');

const isProduction = process.env.NODE_ENV === 'production';

function inspect(obj) {
  const utilOptions = {
    depth: 12,
    colors: true
  };

  console.log(util.inspect(obj, utilOptions));
}

module.exports = (userConfig) => {
  const projectRoot = process.cwd();
  const sourceRoot = `${projectRoot}/src`;

  // merge with base config
  const rookConfig = lodash.merge(baseConfig, userConfig);

  // merge with base webpack config
  const webpackSubset = isProduction ? webpackConfigs.production : webpackConfigs.development;
  const baseWebpackConfig = mergeWebpack(webpackConfigs.common, webpackSubset);
  const combinedWebpackConfig = mergeWebpack(baseWebpackConfig, rookConfig.webpack.config);
  combinedWebpackConfig.context = projectRoot;
  combinedWebpackConfig.resolve.root = sourceRoot;

  // derive webpack output destination from staticPath
  combinedWebpackConfig.output.path = rookConfig.server.staticPath + '/dist';

  // add babel for js transpiling
  const babelConfig = mergeBabel(rookConfig.babelConfig, rookConfig.verbose);
  combinedWebpackConfig.module.loaders.unshift({ test: /\.jsx?$/, exclude: /node_modules/, loaders: babelConfig });

  // gather tools config
  const userToolsConfig = require(path.resolve(rookConfig.toolsConfigPath));
  const combinedToolsConfig = lodash.merge(baseToolsConfig, userToolsConfig);

  // bury it here rather than pollute the project directory
  combinedToolsConfig.webpack_assets_file_path = 'node_modules/rook/webpack-assets.json';

  // add tools settings to combined weback config
  const toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

  combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
  combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

  // turn on linting per webpack build, unless directed not to
  if (rookConfig.lint.enabled !== false && !isProduction) {
    combinedWebpackConfig.module.loaders[0].loaders.push('eslint-loader');
    const lintConfigPath = rookConfig.lint.config || path.resolve(__dirname, '../.eslintrc');
    combinedWebpackConfig.eslint = {
      configFile: lintConfigPath
    };
  }

  // turn on desktop notifications if user elects to
  if (rookConfig.notifications === true && !isProduction) {
    combinedWebpackConfig.plugins.push(new WebpackErrorNotificationPlugin());
  }

  // add default settings that are used by server via process.env
  const definitions = {
    __LOGGER__: false,
    __DEVTOOLS__: !isProduction,
    __DEVELOPMENT__: !isProduction
  };

  // override with user settings
  lodash.each(rookConfig.globals, (value, key) => { definitions[key] = JSON.stringify(value); });
  combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

  // add routes, reducer and rootComponent aliases so that client has access to them
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

  // add project level vendor libs
  if (rookConfig.webpack.vendorLibraries && isProduction) {
    lodash.each(rookConfig.webpack.vendorLibraries, (lib) => {
      combinedWebpackConfig.entry.vendor.push(lib);
    });
  }

  // output configuration files if user wants verbosity
  if (rookConfig.verbose) {
    console.log('\nWebpack config:');
    inspect(combinedWebpackConfig);
    console.log('\nIsomorphic tools config:');
    inspect(combinedToolsConfig);
  }

  rookConfig.webpack.config = combinedWebpackConfig;

  return rookConfig;
};
