/* eslint strict: 0,
  no-shadow: 0,
  no-unused-vars: 0,
  no-console: 0 ,
  import/no-extraneous-dependencies: 0
  */

'use strict';

require('babel-polyfill');
const os = require('os');
const webpack = require('webpack');
const electronCfg = require('./webpack.config.electron.js');
const cfg = require('./webpack.config.production.js');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');

const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);

const appName = argv.name || argv.n || pkg.productName;
const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '^/_org($|/)',
    '^/(open-app|rebuild)',
    '^/main.development.js',
    '^/release($|/)',
    '^/resources($|/)',
    '^/test($|/)',
    '^/tools($|/)',
    '^/webpack($|/)',
    '^/yarn($|/)'
  ]
    .concat(devDeps.map(name => `/node_modules/${name}($|/)`))
    .concat(
      deps
        .filter(name => !electronCfg.externals.includes(name))
        .map(name => `/node_modules/${name}($|/)`)
    )
};

console.log(DEFAULT_OPTS);

const icon = argv.icon || argv.i || 'app/app';

if (icon) {
  DEFAULT_OPTS.icon = icon;
}

const version = argv.version || argv.v;

if (version) {
  DEFAULT_OPTS.electronVersion = version;
  startPack();
} else {
  // Use the same version as the currently installed electron
  exec('npm list electron --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.electronVersion = '1.4.15';
    } else {
      DEFAULT_OPTS.electronVersion = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '');
    }

    startPack();
  });
}

function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
}

function startPack() {
  console.log('start pack...');
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del('release'))
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
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') {
    return;
  }

  const iconObj = {};
  switch (plat) {
    case 'darwin':
      iconObj.icon = 'resources/osx/icon.icns';
      break;
    case 'win32':
      iconObj.icon = 'resources/windows/icon.ico';
      break;
    default:
  }

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    'app-version': pkg.version || DEFAULT_OPTS.electronVersion,
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
