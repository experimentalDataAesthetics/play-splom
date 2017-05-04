const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');

const config = Object.create(baseConfig);

config.devtool = 'source-map';

config.entry = './app/index';

config.output.publicPath = '../dist/';

config.module.rules.push(
  {
    test: /\.global\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader'
        }
      ]
    })
  },
  {
    test: /^((?!\.global).)*\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            // importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }
      ]
    })
  }
);

config.plugins.push(
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  }),
  new ExtractTextPlugin({ filename: 'style.css', disable: false, allChunks: true })
);

module.exports = config;
