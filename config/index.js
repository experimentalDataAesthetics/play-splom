/**
 * This is intended only for the main.js process
 */
import path from 'path';

const config = require(`./${process.env.NODE_ENV}.json`);

// appRoot is different in development and production
// Always use this to calculate a path to any local file.
config.appRoot = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'app')
  : path.join(__dirname, '../app');

module.exports = config;
