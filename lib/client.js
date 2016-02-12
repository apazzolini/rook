'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _useStandardScroll = require('scroll-behavior/lib/useStandardScroll');

var _useStandardScroll2 = _interopRequireDefault(_useStandardScroll);

var _createStore = require('./redux/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _ApiClient = require('./redux/middleware/ApiRequest/ApiClient');

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _fetchComponentData = require('./routing/fetchComponentData');

var _fetchComponentData2 = _interopRequireDefault(_fetchComponentData);

var _routes = require('routes');

var _routes2 = _interopRequireDefault(_routes);

var _middleware = require('middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _rootComponent = require('rootComponent');

var _reactRouterRedux = require('react-router-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Fix this, super hacky. https://github.com/rackt/scroll-behavior/issues/28
var scrollHistory = (0, _useStandardScroll2.default)(function () {
  return _reactRouter.browserHistory;
})();

// These dependencies are resolved via webpack aliases


var dest = document.getElementById('content');
var apiClient = new _ApiClient2.default();
var store = (0, _createStore2.default)(apiClient, _middleware2.default, scrollHistory, window.__data);
var routes = (0, _routes2.default)(store);

var lastMatchedLocBefore = location.pathname + location.search + location.hash;

// FIXME: Temporary hack to ensure initial click fires in production

store.dispatch(_reactRouterRedux.routeActions.push(lastMatchedLocBefore));

_reactRouter.browserHistory.listenBefore(function (location, callback) {
  var loc = location.pathname + location.search + location.hash;
  if (lastMatchedLocBefore === loc) {
    return callback();
  }

  // TODO: Update to new react-router 2.0 RouterContext
  (0, _reactRouter.match)({ routes: routes, location: loc }, function (err, redirectLocation, nextState) {
    if (!err && nextState) {
      lastMatchedLocBefore = loc;

      (0, _fetchComponentData2.default)(nextState.components, store.getState, store.dispatch, location, nextState.params).then(function () {
        callback();
      }).catch(function (err2) {
        console.error(err2, 'Error while fetching data');
        callback();
      });
    } else {
      console.log('Location "%s" did not match any routes (listenBefore)', loc);
      callback();
    }
  });
});

var devComponent = undefined;
if (__DEVTOOLS__) {
  var devtools = require('./client/devtools');
  devComponent = devtools.render();
}

var root = (0, _rootComponent.createForClient)(store, { routes: routes, history: _reactRouter.browserHistory });

_reactDom2.default.render(root, dest);

if (process.env.NODE_ENV !== 'production') {
  window.React = _react2.default; // enable debugger
  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    throw new Error('Server-side React render was discarded. Ensure your ' + 'initial render does not contain any client-side code.');
  }
}

if (devComponent) {
  var rootWithDevTools = (0, _rootComponent.createForClient)(store, { routes: routes, history: _reactRouter.browserHistory, devComponent: devComponent });
  if (rootWithDevTools) {
    _reactDom2.default.render(rootWithDevTools, dest);
  }
}