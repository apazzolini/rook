#!/usr/bin/env node
const hapi = require('../lib/server.js').default;
const renderer = require('../lib/server/renderer').default;
const userConfig = require('./user-config');

// since typically the dev server is logging this out too
userConfig.verbose = false;

const config = require('./merge-configs')(userConfig);

const server = hapi(config);

// Add the Hapi extension that understands how to render React-router paths
server.ext('onPreResponse', renderer(config));

server.start(() => {
  console.info('==> Server is listening at ' + server.info.uri.toLowerCase());
});
