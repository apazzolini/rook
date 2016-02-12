'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactRouter = require('react-router');

var _createMemoryHistory = require('react-router/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _createStore = require('../redux/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

var _tools = require('./tools');

var _tools2 = _interopRequireDefault(_tools);

var _ApiClient = require('../redux/middleware/ApiRequest/ApiClient');

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _fetchComponentData = require('../routing/fetchComponentData');

var _fetchComponentData2 = _interopRequireDefault(_fetchComponentData);

var _getRouteHttpStatus = require('../routing/getRouteHttpStatus');

var _getRouteHttpStatus2 = _interopRequireDefault(_getRouteHttpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false; // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

exports.default = function () {
  var projectRoot = process.cwd();
  var sourceRoot = projectRoot + '/src';
  var tools = (0, _tools2.default)();
  var config = require('../../config/rook');
  var getRoutes = require(_path2.default.resolve(config.routes)).default;
  var rootComponent = require(config.rootComponent ? _path2.default.resolve(config.rootComponent) : '../helpers/rootComponent');

  return function (request, reply) {
    if (request.path.indexOf('/api/') === 0) {
      return reply.continue();
    }

    if (request.response.source !== null) {
      return reply.continue();
    }

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    var initialState = {};
    var reduxModules = require(_path2.default.resolve(_path2.default.join(sourceRoot, 'redux/modules')));
    if (reduxModules.updateInitialServerState) {
      reduxModules.updateInitialServerState(request, initialState);
    }

    var apiClient = new _ApiClient2.default(request);
    var middleware = config.redux.middleware ? require(_path2.default.resolve(config.redux.middleware)).default : [];
    var history = (0, _createMemoryHistory2.default)();
    var store = (0, _createStore2.default)(apiClient, middleware, history, initialState);

    if (__DISABLE_SSR__) {
      reply((0, _html2.default)(config, tools.assets(), store));
    } else {
      (0, _reactRouter.match)({ history: history, routes: getRoutes(store), location: request.url.path }, function (error, redirectLocation, renderProps) {
        if (redirectLocation) {
          reply.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          reply(_boom2.default.wrap(error));
        } else {
          try {
            (0, _fetchComponentData2.default)(renderProps.components, store.getState, store.dispatch, renderProps.location, renderProps.params).then(function (actions) {
              var httpStatus = 0;
              _lodash2.default.each(_lodash2.default.flattenDeep(actions), function (action) {
                if (action.statusCode >= 500) {
                  reply(_boom2.default.wrap(new Error(action.error)));
                }

                if (action.statusCode && action.statusCode > httpStatus) {
                  httpStatus = action.statusCode;
                }
              });

              httpStatus = httpStatus || (0, _getRouteHttpStatus2.default)(renderProps.routes) || 200;

              var component = rootComponent.createForServer(store, renderProps);
              reply((0, _html2.default)(config, tools.assets(), store, null, component)).code(httpStatus);
            }).catch(function (e) {
              reply(_boom2.default.wrap(e));
            });
          } catch (err) {
            reply(_boom2.default.wrap(err));
          }
        }
      });
    }
  };
};