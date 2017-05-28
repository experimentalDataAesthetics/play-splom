// for babel-plugin-webpack-loaders
// Used just by testing on the commandline
require('babel-register');
const devConfigs = require('./webpack.config.development');

module.exports = {
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: devConfigs.module.rules.slice(1) // remove babel-loader
  }
};
