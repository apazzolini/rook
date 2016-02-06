import {Server} from 'hapi';
import Boom from 'boom';
import inert from 'inert';
import PrettyError from 'pretty-error';
import fs from 'fs';
import path from 'path';

import configure from './configure';
import buildApiRoutes from './server/hapi/routes';
import registerExtensions from './server/hapi/extensions';

export default (projectConfig) => {
  const config = configure(projectConfig);

  const pretty = new PrettyError();
  const server = new Server({
    connections: {
      router: {
        stripTrailingSlash: true
      }
    }
  });
  server.connection({port: config.server.port});

  registerExtensions(server, config);

  /**
   * Pretty print any request errors with their stack traces.
   */
  server.on('request-error', (request, err) => {
    console.error('SERVER ERROR:', pretty.render(err));
  });

  /**
   * Register the api routes under the '/api' path prefix.
   */
  server.register(buildApiRoutes(config), {
    routes: {
      prefix: '/api'
    }
  }, (err) => {
    if (err) {
      throw err;
    }
  });

  /**
   * Attempt to serve static requests from the public folder.
   *
   * If the file doesn't exist, don't raise an error - instead, continue
   * normally because the path could match a React route.
   */
  server.register(inert, (err) => {
    if (err) {
      throw err;
    }

    server.route({
      method: 'GET',
      path: '/{params*}',
      handler: (request, reply) => {
        const filePath = path.join('static', request.path);
        fs.lstat(filePath, (statErr, stats) => {
          if (!statErr && stats.isFile()) {
            reply.file(filePath);
          } else {
            reply.continue();
          }
        });
      }
    });
  });

  return server
};
