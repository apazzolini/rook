import lodash from 'lodash';
import path from 'path';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

export default () => {
  const config = require('../../config/rook');

  // Gather tools config
  let toolsConfig = require('../../config/defaults/webpack-isomorphic-tools.js');
  if (config.toolsConfigPath !== null) {
    const userToolsConfig = require(path.resolve(config.toolsConfigPath));
    toolsConfig = lodash.merge(toolsConfig, userToolsConfig);
  }

  const rootDir = config.webpack.config.context;
  const tools = new WebpackIsomorphicTools(toolsConfig);
  tools
    .development(__DEVELOPMENT__)
    .server(rootDir);

  return tools;
};
