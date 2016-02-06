'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createForServer = createForServer;
exports.createForClient = createForClient;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createForServer(store, renderProps) {
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store, key: 'provider' },
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_reactRouter.RouterContext, renderProps)
    )
  );
}

function createForClient(store, _ref) {
  var routes = _ref.routes;
  var history = _ref.history;
  var devComponent = _ref.devComponent;

  var component = _react2.default.createElement(
    _reactRouter.Router,
    { history: history },
    routes
  );

  var root = _react2.default.createElement(
    _reactRedux.Provider,
    { store: store, key: 'provider' },
    _react2.default.createElement(
      'div',
      null,
      component,
      devComponent
    )
  );

  return root;
}