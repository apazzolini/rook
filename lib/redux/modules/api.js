'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Initial State ---------------------------------------------------------------

var initialState = exports.initialState = {
  loading: false
};

// Reducers --------------------------------------------------------------------

var reducers = exports.reducers = {

  '@@rook/apiLoadingStart': function rookApiLoadingStart(state, action) {
    return state.merge({
      loading: true
    });
  },

  '@@rook/apiLoadingFinish': function rookApiLoadingFinish(state, action) {
    var loadError = null;
    if (action.loadError) {
      loadError = {
        msg: action.loadError.toString(),
        stack: action.loadError.stack
      };
    }

    return state.merge({
      loading: false,
      loadError: loadError
    });
  }

};