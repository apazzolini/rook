'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hapi = require('hapi');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

var _routes = require('./server/hapi/routes');

var _routes2 = _interopRequireDefault(_routes);

var _extensions = require('./server/hapi/extensions');

var _extensions2 = _interopRequireDefault(_extensions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (projectConfig) {
  var config = (0, _configure2.default)(projectConfig);

  var pretty = new _prettyError2.default();
  var server = new _hapi.Server({
    connections: {
      router: {
        stripTrailingSlash: true
      }
    }
  });
  server.connection({ port: config.server.port });

  (0, _extensions2.default)(server, config);

  /**
   * Pretty print any request errors with their stack traces.
   */
  server.on('request-error', function (request, err) {
    console.error('SERVER ERROR:', pretty.render(err));
  });

  /**
   * Register the api routes under the '/api' path prefix.
   */
  server.register((0, _routes2.default)(config), {
    routes: {
      prefix: '/api'
    }
  }, function (err) {
    if (err) {
      throw err;
    }
  });

  /**
   * Attempt to serve static requests from the public folder.
   *
   * If the file doesn't exist, don't raise an error - instead, continue
   * normally because the path could match a React route.
   */
  server.register(_inert2.default, function (err) {
    if (err) {
      throw err;
    }

    server.route({
      method: 'GET',
      path: '/{params*}',
      handler: function handler(request, reply) {
        var filePath = _path2.default.join('static', request.path);
        _fs2.default.lstat(filePath, function (statErr, stats) {
          if (!statErr && stats.isFile()) {
            reply.file(filePath);
          } else {
            reply.continue();
          }
        });
      }
    });
  });

  return server;
};