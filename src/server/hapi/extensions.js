import glob from 'glob';

export default (server, config) => {
  const extensionsDir = config.hapiExtensions;
  const extensionFiles = glob.sync(`${extensionsDir}/**/*.js`);

  extensionFiles.forEach((extensionFile) => {
    const extension = require(extensionFile).default;
    extension(server, config);
  });
};
