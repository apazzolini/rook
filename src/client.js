import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history, match } from 'react-router';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import createStore from './redux/createStore';
import ApiClient from './redux/middleware/ApiRequest/ApiClient';
import fetchData from './routing/fetchComponentData';

// These dependencies are resolved via webpack aliases
import getRoutes from 'routes';
import middleware from 'middleware';
import { createForClient as createRootComponentForClient } from 'rootComponent';

// TODO: Fix this, super hacky. https://github.com/rackt/scroll-behavior/issues/28
const scrollHistory = useScroll(() => history)(); 

const dest = document.getElementById('content');
const apiClient = new ApiClient();
const store = createStore(apiClient, middleware, scrollHistory, window.__data);
const routes = getRoutes(store);

let lastMatchedLocBefore = location.pathname + location.search + location.hash;

// FIXME: Temporary hack to ensure initial click fires in production
import { routeActions } from 'react-router-redux';
store.dispatch(routeActions.push(lastMatchedLocBefore));

history.listenBefore((location, callback) => {
  const loc = location.pathname + location.search + location.hash;
  if (lastMatchedLocBefore === loc) {
    return callback();
  }

  // TODO: Update to new react-router 2.0 RouterContext 
  match({ routes, location: loc }, (err, redirectLocation, nextState) => {
    if (!err && nextState) {
      lastMatchedLocBefore = loc;

      fetchData(nextState.components, store.getState, store.dispatch, location, nextState.params)
      .then(() => {
        callback();
      })
      .catch(err2 => {
        console.error(err2, 'Error while fetching data');
        callback();
      });
    } else {
      console.log('Location "%s" did not match any routes (listenBefore)', loc);
      callback();
    }
  });
});

let devComponent;
if (__DEVTOOLS__) {
  const devtools = require('./client/devtools');
  devComponent = devtools.render();
}

const root = createRootComponentForClient(store, { routes, history });

ReactDOM.render(root, dest);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
  if (!dest || !dest.firstChild || !dest.firstChild.attributes 
      || !dest.firstChild.attributes['data-react-checksum']) {
    throw new Error('Server-side React render was discarded. Ensure your ' + 
      'initial render does not contain any client-side code.');
  }
}

if (devComponent) {
  const rootWithDevTools = createRootComponentForClient(store, { routes, history, devComponent });
  if (rootWithDevTools) {
    ReactDOM.render(rootWithDevTools, dest);
  }
}
