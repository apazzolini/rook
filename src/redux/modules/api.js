// Initial State ---------------------------------------------------------------

export const initialState = {
  loading: false
};

// Reducers --------------------------------------------------------------------

export const reducers = {

  '@@rook/apiLoadingStart': (state, action) => state.merge({
    loading: true
  }),

  '@@rook/apiLoadingFinish': (state, action) => state.merge({
    loading: false
  })

};
