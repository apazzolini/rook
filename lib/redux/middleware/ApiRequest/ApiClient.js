'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ApiClient = function () {
  /**
   * @param {Hapi Request} (optional) the request the server received for a full
   *        server-rendered page. The request may include cookies or other user
   *        identifying information to correctly make API calls on behalf of
   *        the requesting user
   */

  function ApiClient(serverReq) {
    (0, _classCallCheck3.default)(this, ApiClient);

    this.apiPath = require('../../../../config/client-app').apiPath;
    this.defaultOptions = {
      credentials: 'same-origin',
      headers: {}
    };

    if (__SERVER__) {
      // If we're executing a server-side fetch on behalf of the user for universal
      // rendering, we need to forward along the cookies.
      this.defaultOptions.headers.cookie = serverReq.headers.cookie;
    }
  }

  (0, _createClass3.default)(ApiClient, [{
    key: 'get',
    value: function get(path) {
      var options = (0, _extends3.default)({}, this.defaultOptions);

      return this.performFetch(path, options);
    }
  }, {
    key: 'post',
    value: function post(path, data) {
      var options = (0, _extends3.default)({}, this.defaultOptions, {
        method: 'post',
        body: (0, _stringify2.default)(data)
      });
      options.headers['Accept'] = 'application/json'; // eslint-disable-line dot-notation
      options.headers['Content-Type'] = 'application/json';

      return this.performFetch(path, options);
    }
  }, {
    key: 'delete',
    value: function _delete(path) {
      var options = (0, _extends3.default)({}, this.defaultOptions, {
        method: 'delete'
      });

      return this.performFetch(path, options);
    }
  }, {
    key: 'performFetch',
    value: function performFetch(path, options) {
      var url = this.formatUrl(path);
      return (0, _isomorphicFetch2.default)(url, options).then(function (data) {
        return data.json();
      });
    }
  }, {
    key: 'formatUrl',
    value: function formatUrl(path) {
      var adjustedPath = path[0] !== '/' ? '/' + path : path;
      return this.apiPath + adjustedPath;
    }
  }]);
  return ApiClient;
}();

exports.default = ApiClient;