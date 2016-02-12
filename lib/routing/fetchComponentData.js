"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the route component's fetchData property if it exists. If the
 * given component is a WrappedComponent, this method will unwrap
 * to the base component to search for fetchData.
 *
 * @param {Object} component - A React component
 */
var getFetchData = function getFetchData() {
  var component = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return component.WrappedComponent ? getFetchData(component.WrappedComponent) : component.fetchData;
};

/**
 * 1. Find components with a fetchData method
 * 2. Extract the fetchData methods
 * 3. Run fetchData methods
 */
var executeFetchDatas = function executeFetchDatas(components, getState, dispatch, location, params) {
  return components.filter(function (component) {
    return getFetchData(component);
  }).map(function (component) {
    return getFetchData(component).bind(component);
  }).map(function (fetchData) {
    return fetchData(getState, dispatch, location, params);
  });
};

exports.default = function (components, getState, dispatch, location, params) {
  return _promise2.default.all(executeFetchDatas(components, getState, dispatch, location, params));
};