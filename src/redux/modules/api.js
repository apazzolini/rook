// Initial State ---------------------------------------------------------------

export const initialState = {
  loading: false
};

// Reducers --------------------------------------------------------------------

export const reducers = {

  '@@rook/apiLoadingStart': (state, action) => state.merge({
    loading: true
  }),

  '@@rook/apiLoadingFinish': (state, action) => {
    let loadError = null;
    if (action.loadError) {
      loadError = {
        msg: action.loadError.toString(),
        stack: action.loadError.stack
      };
    }

    return state.merge({
      loading: false,
      loadError
    });
  }

};
