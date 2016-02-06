import glob from 'glob';
import path from 'path';

export default (server, config) => {
  const extensionsDir = config.hapiExtensions;
  const extensionFiles = glob.sync(`${extensionsDir}/**/*.js`);

  extensionFiles.forEach((extensionFile) => {
    const extension = require(extensionFile).default;
    extension(server, config);
  });

};
