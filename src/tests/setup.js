const mocha = require('mocha');
const chai = require('chai');
const chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);

const Server = require('hapi').Server;

const userConfig = require('../../bin/user-config');
userConfig.verbose = false;
const config = require('../../bin/merge-configs')(userConfig);

const server = new Server();
server.connection({port: config.server.testPort});

const buildApiRoutes = require('../../lib/server/hapi/routes').default;
const registerExtensions = require('../../lib/server/hapi/extensions').default;

registerExtensions(server, config);
server.register(buildApiRoutes(config), (err) => {
  if (err) {
    throw err;
  }
});

server.start(() => {
  console.info(`Test server is listening at ${server.info.uri.toLowerCase()}\n`);
});

module.exports = { server };
