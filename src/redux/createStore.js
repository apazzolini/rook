import createLogger from 'redux-logger';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';

import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import apiRequestMiddleware from './middleware/ApiRequest/apiRequest';
import * as apiLoadingReducer from './modules/api';
import createReducer from './createReducer';

// explicit path required for HMR to function. see #7
import reducers from '../../../../src/redux/modules';

function createRootReducer(reducers) {
  const rootReducer = {
    routing: routeReducer,
    apiRequest: createReducer(apiLoadingReducer)
  };

  for (let [k, v] of Object.entries(reducers)) {
    rootReducer[k] = createReducer(v);
  }

  return combineReducers(rootReducer);
}

function hmr(store) {
  if (module.hot) {
    module.hot.accept('../../../../src/redux/modules', () => {
      const nextReducers = require('../../../../src/redux/modules/index').default;
      const nextRootReducer = createRootReducer(nextReducers);
      store.replaceReducer(nextRootReducer);
    });
  }
}

export default function create(apiClient, providedMiddleware, history, data) {
  const rootReducer = createRootReducer(reducers);
  const router = syncHistory(history);
  let middleware = [
    router,
    thunk,
    apiRequestMiddleware(apiClient)
  ];

  if (providedMiddleware && providedMiddleware.length > 0) {
    middleware = middleware.concat(providedMiddleware);
  }

  if (__CLIENT__ && __LOGGER__) {
    middleware.push(createLogger({ collapsed: true }));
  }

  let finalCreateStore;

  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const devtools = require('../client/devtools');

    finalCreateStore = devtools.compose(middleware)(createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
  }

  const store = finalCreateStore(rootReducer, data);

  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const devtools = require('../client/devtools');
    devtools.listenToRouter(router, store);
  }

  hmr(store);

  return store;
}

