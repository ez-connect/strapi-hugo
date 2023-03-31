/* eslint-disable no-unused-vars */

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config
  config.plugins.push(new MonacoWebpackPlugin());

  return config;
};
