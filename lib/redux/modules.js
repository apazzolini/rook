'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var rootDir = process.cwd();
  var modulesDir = _path2.default.resolve(rootDir, 'src/redux/modules');

  var modules = {
    routing: _reactRouterRedux.routeReducer
  };

  var moduleFiles = _glob2.default.sync(modulesDir + '/**/*.js');
  moduleFiles.forEach(function (moduleFile) {
    var module = require(moduleFile);
    var moduleName = _path2.default.basename(moduleFile, '.js');

    if (moduleName === 'routing') {
      throw "Cannot declare a module named routing as that is used by react-router-redux";
    }

    var reducer = (0, _reduxImmutablejs.createReducer)(_immutable2.default.fromJS(module.initialState), module.reducers);
    modules[moduleName] = reducer;
  });

  return (0, _redux.combineReducers)(modules);
};

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxImmutablejs = require('redux-immutablejs');

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

// const adminReducer = createReducer(Immutable.fromJS(admin.initialState), admin.reducers);
// const docsReducer = createReducer(Immutable.fromJS(docs.initialState), docs.reducers);

/*
//import glob from 'glob';
import path from 'path';
import Immutable from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';

// const adminReducer = createReducer(Immutable.fromJS(admin.initialState), admin.reducers);
// const docsReducer = createReducer(Immutable.fromJS(docs.initialState), docs.reducers);

export default function() {
  const rootDir = process.cwd();
  const modulesDir = path.resolve(rootDir, 'src/redux/modules');

  const modules = {
    routing: routeReducer
  };

  const customModules = new Map()
    .set('docs', require(path.join(modulesDir, 'docs')))
    .set('admin', require(path.join(modulesDir, 'admin')))

  for (let [key, value] of customModules.entries()) {
    modules[key] = createReducer(Immutable.fromJS(module.initialState), module.reducers); 
  }

  console.log(modules)

  //return combineReducers(modules);

  const admin = require(path.join(modulesDir, 'admin'));
  const docs = require(path.join(modulesDir, 'docs'));

  return combineReducers({
    routing: routeReducer,
    admin: createReducer(Immutable.fromJS(admin.initialState), admin.reducers),
    docs: createReducer(Immutable.fromJS(docs.initialState), docs.reducers)
  });
};
*/