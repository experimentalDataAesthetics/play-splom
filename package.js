/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
'use strict';

const os = require('os');
const webpack = require('webpack');
const cfg = require('./webpack.config.production.js');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const devDeps = Object.keys(pkg.devDependencies);
const deps = Object.keys(pkg.dependencies);
const _ = require('lodash');
const jetpack = require('fs-jetpack');

const appName = argv.name || argv.n || pkg.productName;
const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;

// whitelist the ones you do need for main.js
// supercolliderjs d3 lodash dryadic winston
// fs-jetpack
// electron
// q
// mkdirp
// rimraf
// minimatch
// brace-expansion
// etc
// better to just bundle that too
//
function ignoreMe(name) {
  return `^/node_modules/${name}($|/)`;
}

const nodeModules = jetpack.list('node_modules');

// webpack compiles main.js and posts what paths it had to include.
// This list is derived from that and has to be updated anytime
// any package used by main.js changes.
// Ideally the main process would run using the dist/main.js that is bundled
// and minified.
const includeModules = [
  'baconjs',
  'balanced-match',
  'brace-expansion',
  'colors',
  'concat-map',
  'cycle',
  'electron-debug',
  'electron-is-dev',
  'escape-string-regexp',
  'electron-localshortcut',
  'fs-jetpack',
  'inflight',
  'inherits',
  'isstream',
  'keymirror',
  'lodash',
  'minimatch',
  'mkdirp',
  'once',
  'path-is-absolute',
  'pkginfo',
  'q',
  'rimraf',
  'stack-trace',
  'strip-ansi',
  'winston',
  'wrappy',
  'dryadic',
  'supercolliderjs',
  'async',
  'minimst',
  'glob'
];

// or read each package.json in the above and add all modules in its package
// npm3 means you need it deep and flat.

const ignoreModules = [];
// _.difference(nodeModules, includeModules);

// console.log(ignoreModules);

const ignore = [
  // regex
  /^\/\..*/,
  '^/package.js$',
  '^/server.js$',
  '^/build-main.sh$',
  '^/logs($|/)',
  '^/org($|/)',
  /^\/release\//,
  '^/test($|/)',
  '^/tools($|/)',
  '^/webpack*'

  // (f) => {
  //   sclog.debug('ignore?', f);
  //   return false;
  // }
  // '/package.js'
  // why am I including node_modules ?
  // it should be just the bundle.js
  // resources/ not the current app you are building
  // app/vendor/supercollider/not-current-os
].concat(devDeps.map(ignoreMe)).concat(ignoreModules.map(ignoreMe));

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore
};

const version = argv.version || argv.v;

if (version) {
  DEFAULT_OPTS.version = version;
  startPack();
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron-prebuilt --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '0.37.6';
    } else {
      DEFAULT_OPTS.version = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '');
    }

    startPack();
  });
}

function startPack() {
  console.log('start pack...');
  webpack(cfg, (err, stats) => {
    if (err) return console.error(err);
    del('release')
    .then(paths => {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64'];
        const platforms = ['linux', 'win32', 'darwin'];

        platforms.forEach(plat => {
          archs.forEach(arch => {
            pack(plat, arch, log(plat, arch));
          });
        });
      } else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch(err => {
      console.error(err);
    });
  });
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return;

  const iconObj = {};
  switch (plat) {
    case 'darwin':
      iconObj.icon = 'resources/osx/icon.icns';
      break;
    case 'win32':
      iconObj.icon = 'resources/windows/icon.ico';
      break;
    default:
      iconObj.icon = 'resources/icon.png';
  }

  console.log(iconObj);

  // strip out resources and vendor
  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true, // should we ?
    'app-version': pkg.version || DEFAULT_OPTS.version,
    out: `release/${plat}-${arch}`
  });

  packager(opts, cb);
}

function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err);
    console.log(`${plat}-${arch} finished!`);
  };
}
