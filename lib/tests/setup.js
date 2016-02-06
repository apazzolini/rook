'use strict';

var mocha = require('mocha');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);

var Server = require('hapi').Server;

var userConfig = require('../../bin/user-config');
userConfig.verbose = false;
var config = require('../../bin/merge-configs')(userConfig);

var server = new Server();
server.connection({ port: config.server.testPort });

var buildApiRoutes = require('../../lib/server/hapi/routes').default;
var registerExtensions = require('../../lib/server/hapi/extensions').default;

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