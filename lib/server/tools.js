'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackIsomorphicTools = require('webpack-isomorphic-tools');

var _webpackIsomorphicTools2 = _interopRequireDefault(_webpackIsomorphicTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var config = require('../../config/rook');

  // Gather tools config
  var toolsConfig = require('../../config/defaults/webpack-isomorphic-tools.js');
  if (config.toolsConfigPath !== null) {
    var userToolsConfig = require(_path2.default.resolve(config.toolsConfigPath));
    toolsConfig = _lodash2.default.merge(toolsConfig, userToolsConfig);
  }

  var rootDir = config.webpack.config.context;
  var tools = new _webpackIsomorphicTools2.default(toolsConfig);
  tools.development(__DEVELOPMENT__).server(rootDir);

  return tools;
};