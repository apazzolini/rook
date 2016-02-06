// This file is a shim for loading the client app's client config.
//
// The Hapi server does not run through webpack, so the declared module alias
// does not exist in this context and we must load it from the filesystem.
//
// On the other hand, when we're loading the config on the front-end app, we
// must use the webpack module alias, as we don't have access to the filesystem.

if (__SERVER__) {
  const path = require('path');
  const userConfigPath = path.join(process.cwd(), './config/client.js');
  module.exports = require(path.resolve(userConfigPath));
} else {
  module.exports = require('client-app-config');
}
