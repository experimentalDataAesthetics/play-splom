
const path = require('path');

module.exports = {
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-renderer',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(?:csv|scd|scsyndef)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(?:png|jpg|svg)$/,
        loader: 'url-loader'
      },
      {
        test: /LICENSE$/,
        loader: 'null'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  // https://github.com/webpack/webpack/issues/1260
  resolveLoader: {
    root: path.resolve('./node_modules')
  },
  plugins: [
  ],
  externals: [
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
    // cannot compile these.
    // Critical dependencies:
    // the request of a dependency is an expression
    // cannot find miso.events
    'winston',
    'colors',
    'miso.dataset',
    'miso.events',
    // doesnt get the submodules
    // better to import just the ones you need anyway
    'lodash',
    // not loading the dryad classes ?
    // scsynthdef missing
    'supercolliderjs'
  ]
};
