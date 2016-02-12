'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For every js file defined in [rootDir]/src/api/routes, register the
 * Hapi.js routes exported by that file under the `routes` export.
 */

exports.default = function (config) {
  var routesDir = config.apiRoutes;
  var apiExport = {};

  var routeFiles = _glob2.default.sync(routesDir + '/**/*.js');

  apiExport.register = function (server, options, next) {
    // TODO: Can we rewrite this using Redux compose/applyMiddleware patterns?
    var getTryCatchWrappedHandler = function getTryCatchWrappedHandler(handler) {
      return function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(request, reply) {
          var response, errObj;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return handler(request, reply);

                case 3:
                  response = _context.sent;


                  if (response === null) {
                    // By convention, if the response is null, we'll return a 404
                    reply(_boom2.default.notFound());
                  } else if (response._events) {
                    // The handler called reply()
                    // do nothing as the response is already set
                  } else {
                      reply(response);
                    }
                  _context.next = 11;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context['catch'](0);
                  errObj = _context.t0 instanceof Error ? _context.t0 : new Error(_context.t0);

                  reply(_boom2.default.wrap(errObj));

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, undefined, [[0, 7]]);
        })),
            _this = undefined;
        return function (_x, _x2) {
          return ref.apply(_this, arguments);
        };
      }();
    };

    routeFiles.forEach(function (routeFile) {
      var routes = require(routeFile).routes;
      var preparedRoutes = routes.map(function (route) {
        var wrappedHandler = function () {
          var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(request, reply) {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return getTryCatchWrappedHandler(route.handler)(request, reply);

                  case 2:
                    return _context2.abrupt('return', _context2.sent);

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          })),
              _this = undefined;
          return function wrappedHandler(_x3, _x4) {
            return ref.apply(_this, arguments);
          };
        }();

        // TODO: This needs to be expanded to capture all Hapi properties
        var preparedRoute = {
          path: route.path,
          method: route.method,
          handler: wrappedHandler,
          config: {
            auth: route.auth,
            validate: {
              query: route.query,
              params: route.params,
              payload: route.payload
            }
          }
        };

        if (route.config) {
          preparedRoute.config = (0, _extends3.default)({}, preparedRoute.config, route.config);
        }

        return preparedRoute;
      });

      server.route(preparedRoutes);
    });

    next();
  };

  apiExport.register.attributes = {
    name: 'api',
    version: '0.1.0'
  };

  return apiExport;
};