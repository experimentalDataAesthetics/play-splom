/**
 * main.development.js -> main.js
 *
 * Config for the main process for electron
 */

import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseConfig from './webpack.config.base';

export default {
  ...baseConfig,

  devtool: 'source-map',

  entry: './main.development',

  output: {
    ...baseConfig.output,
    path: __dirname,
    filename: './main.js'
  },

  plugins: [
    // now I'm getting everything anyway
    new CopyWebpackPlugin([
      {
        // context: path.join(__dirname, 'app'),
        from: 'synthdefs',
        to: 'synthdefs'
        // to: path.join(__dirname, 'dist', 'app', 'synthdefs')
        // to: '/Users/crucial/Desktop/synthdefs'
      },
      {
        from: 'vendor',
        to: 'vendor'
      }
    ]),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  },

  externals: [...baseConfig.externals, 'source-map-support']
};
