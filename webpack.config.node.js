// for babel-plugin-webpack-loaders
const devConfigs = require('./webpack.config.development');
// const path = require('path');

const externals = {};
[
  'electron',
  'pkginfo',
  'winston'
].forEach((name) => {
  externals[name] = `commonjs ${name}`;
});

module.exports = {
  entry: './main.js',
  output: {
    path: __dirname,
    filename: 'main-bundled.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  module: {
    loaders: devConfigs.module.loaders
    // .slice(1)  // remove babel-loader
  },
  externals
};
