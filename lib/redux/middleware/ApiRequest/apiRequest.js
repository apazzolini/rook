'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (api) {
  return function (_ref) {
    var getState = _ref.getState;
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        // We only handle actions that have a `apiRequest` field.
        var apiRequest = action.apiRequest;
        var type = action.type;
        var rest = (0, _objectWithoutProperties3.default)(action, ['apiRequest', 'type']);

        if (!apiRequest) {
          return next(action);
        }

        // Generate the convention-based dispatch types
        var REQUEST = type;
        var OK = type + 'Ok';
        var FAIL = type + 'Fail';

        // Immediately dispatch the REQUEST action.
        next((0, _extends3.default)({}, rest, { type: REQUEST }));

        // Dispatch the API_LOADING_START action
        next({ type: '@@rook/apiLoadingStart' });

        // Execute the API request and dispatch the OK or FAIL action type
        return apiRequest(api).then(function (result) {
          next({ type: '@@rook/apiLoadingFinish' });
          if (result.error) {
            return next((0, _extends3.default)({}, rest, { error: result.error, type: FAIL }));
          }

          return next((0, _extends3.default)({}, rest, { result: result, type: OK }));
        }, function (error) {
          next({ type: '@@rook/apiLoadingFinish' });
          return next((0, _extends3.default)({}, rest, { error: error, type: FAIL }));
        });
      };
    };
  };
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }