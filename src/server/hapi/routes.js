import glob from 'glob';
import Boom from 'boom';

/**
 * For every js file defined in [rootDir]/src/api/routes, register the
 * Hapi.js routes exported by that file under the `routes` export.
 */
export default (config) => {
  const routesDir = config.apiRoutes;
  const apiExport = {};

  const routeFiles = glob.sync(`${routesDir}/**/*.js`);

  apiExport.register = (server, options, next) => {
    // TODO: Can we rewrite this using Redux compose/applyMiddleware patterns?
    const getTryCatchWrappedHandler = (handler) => {
      return async (request, reply) => {

        try {
          const response = await handler(request, reply);

          if (response === null) {
            // By convention, if the response is null, we'll return a 404
            reply(Boom.notFound());
          } else if (response._events) {
            // The handler called reply()
            // do nothing as the response is already set
          } else {
            reply(response);
          }
        } catch (e) {
          const errObj = (e instanceof Error) ? e : new Error(e);
          reply(Boom.wrap(errObj));
        }
      };
    };

    routeFiles.forEach((routeFile) => {
      const routes = require(routeFile).routes;
      const preparedRoutes = routes.map((route) => {
        const wrappedHandler = async (request, reply) => {
          return await getTryCatchWrappedHandler(route.handler)(request, reply);
        };

        // TODO: This needs to be expanded to capture all Hapi properties
        const preparedRoute = {
          path: route.path,
          method: route.method,
          handler: wrappedHandler,
          config: {
            auth: route.auth,
            validate: {
              query: route.query,
              params: route.params,
              payload: route.payload
            }
          }
        };

        if (route.config) {
          preparedRoute.config = {
            ...preparedRoute.config,
            ...route.config
          };
        }

        return preparedRoute;
      });

      server.route(preparedRoutes);
    });

    next();
  };

  apiExport.register.attributes = {
    name: 'api',
    version: '0.1.0'
  };

  return apiExport;
};

