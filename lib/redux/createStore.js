'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _iterator2 = require('babel-runtime/core-js/symbol/iterator');

var _iterator3 = _interopRequireDefault(_iterator2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;
exports.default = create;

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reactRouterRedux = require('react-router-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _redux = require('redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxImmutablejs = require('redux-immutablejs');

var _devtools = require('../client/devtools');

var _apiRequest = require('./middleware/ApiRequest/apiRequest');

var _apiRequest2 = _interopRequireDefault(_apiRequest);

var _modules = require('../../../../src/redux/modules');

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createReducer(reducer) {
  return (0, _reduxImmutablejs.createReducer)(_immutable2.default.fromJS(reducer.initialState), reducer.reducers);
}

// explicit path required for HMR to function. see #7

function createRootReducer(reducers) {
  var rootReducer = {
    routing: _reactRouterRedux.routeReducer
  };

  _Object$entries = (0, _entries2.default)(reducers);

  if (!(_Object$entries && (typeof _Object$entries[_iterator3.default] === 'function' || Array.isArray(_Object$entries)))) {
    throw new TypeError('Expected _Object$entries to be iterable, got ' + _inspect(_Object$entries));
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(_Object$entries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _Object$entries;

      var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

      var k = _step$value[0];
      var v = _step$value[1];

      rootReducer[k] = createReducer(v);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return (0, _redux.combineReducers)(rootReducer);
}

function hmr(store) {
  if (module.hot) {
    module.hot.accept('../../../../src/redux/modules', function () {
      var nextReducers = require('../../../../src/redux/modules/index').default;
      var nextRootReducer = createRootReducer(nextReducers);
      store.replaceReducer(nextRootReducer);
    });
  }
}

function create(apiClient, providedMiddleware, history, data) {
  var rootReducer = createRootReducer(_modules2.default);
  var router = (0, _reactRouterRedux.syncHistory)(history);
  var middleware = [router, _reduxThunk2.default, (0, _apiRequest2.default)(apiClient)];

  if (providedMiddleware && providedMiddleware.length > 0) {
    middleware = middleware.concat(providedMiddleware);
  }

  if (__CLIENT__ && __LOGGER__) {
    middleware.push((0, _reduxLogger2.default)({ collapsed: true }));
  }

  var useDevtools = __DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__;
  var finalCreateStore = useDevtools ? (0, _devtools.compose)(middleware)(_redux.createStore) : _redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(middleware))(_redux.createStore);

  var store = finalCreateStore(rootReducer, data);

  (0, _devtools.listenToRouter)(router, store);

  hmr(store);

  return store;
}

function _inspect(input) {
  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === 'undefined' ? 'undefined' : (0, _typeof3.default)(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var first = _inspect(input[0]);

      if (input.every(function (item) {
        return _inspect(item) === first;
      })) {
        return first.trim() + '[]';
      } else {
        return '[' + input.map(_inspect).join(', ') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    var keys = (0, _keys2.default)(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    var entries = keys.map(function (key) {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : (0, _stringify2.default)(key)) + ': ' + _inspect(input[key]) + ';';
    }).join('\n  ');

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + entries + '\n}';
    } else {
      return '{ ' + entries + '\n}';
    }
  }
}