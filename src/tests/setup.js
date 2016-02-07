const mocha = require('mocha');
const chai = require('chai');
const chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);

const config = require('../../config/rook');

const Server = require('hapi').Server;
const server = new Server();
server.connection({port: config.server.testPort});

const buildApiRoutes = require('../server/hapi/routes').default;
const registerExtensions = require('../server/hapi/extensions').default;

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
