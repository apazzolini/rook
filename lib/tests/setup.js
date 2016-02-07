'use strict';

var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);

var config = require('../../config/rook');

var Server = require('hapi').Server;
var server = new Server();
server.connection({ port: config.server.testPort });

var buildApiRoutes = require('../server/hapi/routes').default;
var registerExtensions = require('../server/hapi/extensions').default;

registerExtensions(server, config);

server.register(buildApiRoutes(config), function (err) {
  if (err) {
    throw err;
  }
});

server.start(function () {
  console.info('Test server is listening at ' + server.info.uri.toLowerCase() + '\n');
});

module.exports = { server: server };