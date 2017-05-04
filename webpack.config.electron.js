/**
 * main.development.js -> main.js
 *
 * Config for the main process for electron
 */
import path from 'path';
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
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'app', 'synthdefs'),
        to: 'synthdefs'
      },
      {
        from: path.join(__dirname, 'app', 'vendor'),
        to: 'vendor'
      }
    ]),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
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
