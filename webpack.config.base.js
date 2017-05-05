const path = require('path');
const webpack = require('webpack');

module.exports = {
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(?:csv|scd|scsyndef)$/,
        use: 'file-loader'
      },
      {
        test: /\.(?:png|jpg|svg)$/,
        use: 'url-loader'
      },
      {
        test: /LICENSE$/,
        use: 'null'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [new webpack.NamedModulesPlugin()],
  externals: [
    // Put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
    // Including any libraries that are ES6 as UglifyJS cannot handle those yet.
    'binpack',
    'colors',
    'cuid',
    'data-projector',
    'd3',
    'electron-debug',
    'table',
    'temp',
    'untildify',
    'winston',
    'lodash',
    // for osc-min and binpack
    'supercolliderjs',
    'dryadic'
  ]
};
