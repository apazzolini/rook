'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (reducer) {
  return (0, _reduxImmutablejs.createReducer)(_immutable2.default.fromJS(reducer.initialState), reducer.reducers);
};

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxImmutablejs = require('redux-immutablejs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;