import path from 'path';
import { match } from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import Boom from 'boom';

import createStore from '../redux/createStore';
import html from './html';
import getTools from './tools';

import ApiClient from '../redux/middleware/ApiRequest/ApiClient';
import fetchData from '../routing/fetchComponentData';
import getRouteHttpStatus from '../routing/getRouteHttpStatus';

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

export default () => {
  const projectRoot = process.cwd();
  const sourceRoot = `${projectRoot}/src`;
  const tools = getTools();
  const config = require('../../config/rook');
  const getRoutes = require(path.resolve(config.routes)).default;
  const rootComponent = require(config.rootComponent ? path.resolve(config.rootComponent) : '../helpers/rootComponent');

  return (request, reply) => {
    if (request.path.indexOf('/api/') === 0) {
      return reply.continue();
    }

    if (request.response.source !== null) {
      return reply.continue();
    }

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    const initialState = {};
    const reduxModules = require(path.resolve(path.join(sourceRoot, 'redux/modules')));
    if (reduxModules.updateInitialServerState) {
      reduxModules.updateInitialServerState(request, initialState);
    }

    const apiClient = new ApiClient(request);
    const middleware = config.redux.middleware ? require(path.resolve(config.redux.middleware)).default : [];
    const history = createMemoryHistory();
    const store = createStore(apiClient, middleware, history, initialState);

    if (__DISABLE_SSR__) {
      reply(html(config, tools.assets(), store));
    } else {
      match({ history, routes: getRoutes(store), location: request.url.path }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          reply.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          reply(Boom.wrap(error));
        } else {
          try {
            fetchData(
              renderProps.components,
              store.getState, store.dispatch,
              renderProps.location,
              renderProps.params
            ).then(() => {
              const component = rootComponent.createForServer(store, renderProps);
              const httpStatus = getRouteHttpStatus(renderProps.routes) || 200;
              reply(html(config, tools.assets(), store, null, component)).code(httpStatus);
            }).catch((e) => {
              reply(Boom.wrap(e));
            });
          } catch (err) {
            reply(Boom.wrap(err));
          }
        }
      });
    }
  };
};
