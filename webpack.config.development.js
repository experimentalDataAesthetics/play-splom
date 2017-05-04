const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

const config = Object.create(baseConfig);

config.devtool = 'source-map';

// appends both to same bundle
// https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9#.iz6c8joc9
config.entry = [
  'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
  './app/index'
];

config.output.publicPath = 'http://localhost:3000/dist/';

config.module.rules.push(
  {
    test: /\.global\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /^((?!\.global).)*\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: true,
          importLoader: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  }
);

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env.NODE_ENV': JSON.stringify('development')
  })
);

module.exports = config;
