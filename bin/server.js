#!/usr/bin/env node
const config = require('../config/rook');
const hapi = require('../lib/server.js').default;
const renderer = require('../lib/server/renderer').default;

const server = hapi();

// Add the Hapi extension that understands how to render React-router paths
server.ext('onPreResponse', renderer());

server.start(() => {
  console.info('==> Server is listening at http://' + config.server.host.toLowerCase() + ':' + config.server.port);
});
