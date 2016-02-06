import React from 'react';
import {Provider} from 'react-redux';
import {Router, RouterContext} from 'react-router';

export function createForServer(store, renderProps) {
  return (
    <Provider store={store} key="provider">
      <div>
        <RouterContext {...renderProps} />
      </div>
    </Provider>
  );
}

export function createForClient(store, {routes, history, devComponent}) {
  const component = (
    <Router history={history}>
      {routes}
    </Router>
  );

  const root = (
    <Provider store={store} key="provider">
      <div>
        {component}
        {devComponent}
      </div>
    </Provider>
  );

  return root;
}
