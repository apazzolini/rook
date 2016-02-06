'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (server, config) {
  var extensionsDir = config.hapiExtensions;
  var extensionFiles = _glob2.default.sync(extensionsDir + '/**/*.js');

  extensionFiles.forEach(function (extensionFile) {
    var extension = require(extensionFile).default;
    extension(server, config);
  });
};