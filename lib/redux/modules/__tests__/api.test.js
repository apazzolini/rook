'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _createReducer = require('../../createReducer');

var _createReducer2 = _interopRequireDefault(_createReducer);

var _api = require('../api');

var api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = (0, _createReducer2.default)(api);

describe('redux', function () {
  describe('reducers', function () {
    describe('api', function () {
      var initialState = _immutable2.default.fromJS(reducer.initialState);

      it('handles apiLoadingStart', function () {
        var newState = reducer(initialState, {
          type: '@@rook/apiLoadingStart'
        });

        (0, _chai.expect)(newState.toJS()).to.deep.equal({
          loading: true
        });
      });

      it('handles apiLoadingFinish', function () {
        var error = {
          toString: function toString() {
            return 'toString';
          },
          stack: 'stack'
        };

        var newState = reducer(initialState, {
          type: '@@rook/apiLoadingFinish',
          loadError: error
        });

        (0, _chai.expect)(newState.toJS()).to.deep.equal({
          loading: false,
          loadError: {
            msg: 'toString',
            stack: 'stack'
          }
        });
      });
    });
  });
});