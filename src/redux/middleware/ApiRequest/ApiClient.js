import fetch from 'isomorphic-fetch';

export default class ApiClient {
  /**
   * @param {Hapi Request} (optional) the request the server received for a full
   *        server-rendered page. The request may include cookies or other user
   *        identifying information to correctly make API calls on behalf of
   *        the requesting user
   */
  constructor(serverReq) {
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

  performRequest(method, path, data) {
    const options = {
      ...this.defaultOptions,
      method,
      body: JSON.stringify(data)
    };
    options.headers['Accept'] = 'application/json'; // eslint-disable-line dot-notation
    options.headers['Content-Type'] = 'application/json';

    return this.performFetch(path, options);
  }

  get(path) {
    const options = {
      ...this.defaultOptions
    };

    return this.performFetch(path, options);
  }

  post(path, data) {
    this.performRequest('post', path, data);
  }

  delete(path) {
    const options = {
      ...this.defaultOptions,
      method: 'delete'
    };

    return this.performFetch(path, options);
  }

  put(path, data) {
    this.performRequest('put', path, data);
  }

  patch(path, data) {
    this.performRequest('patch', path, data);
  }

  performFetch(path, options) {
    const url = this.formatUrl(path);
    return fetch(url, options).then(data => data.json());
  }

  formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    return this.apiPath + adjustedPath;
  }
}

