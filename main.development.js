/* eslint strict: 0 */
'use strict';
/**
 * The backend application that creates windows
 * and launches the frontend application app/index.js
 *
 * All modules should use require, not import
 * as this is not babel processed.
 *
 * `let` and `const` and arrow functions are fine as
 * well as all listed here: https://kangax.github.io/compat-table/es6/#node4
 */
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const shell = electron.shell;
const path = require('path');
const pkg = require('./package.json');
import SoundApp from './app/sound/SoundApp.js';

const debug = process.env.NODE_ENV !== 'development';
// uncomment this to force debug mode in a production build
// const debug = true;

const debugLevel = debug ? 'debug' : 'info';
// const debugLevel = 'debug';

const winston = require('winston');
winston.level = debugLevel;
winston.loggers.add('sc', {
  console: {
    colorize: true,
    level: debugLevel
  }
});

if (debug) {
  // os x only
  winston.add(winston.transports.File, {
    // filename: path.join(__dirname, 'logs/log.log')
    filename: '/Users/crucial/Library/Logs/play-splom/log.log'
  });
}

const log = winston;
const sclog = winston;  // winston.loggers.get('sc');

let menu;
let template;
let mainWindow = null;

const synthDefsDir = path.join(__dirname, 'app/synthdefs');

const soundApp = new SoundApp(sclog);

function loadSounds(window) {
  soundApp.loadSounds(synthDefsDir, (action) => {
    log.debug('dispatch-action', action);
    window.webContents.send('dispatch-action', action);
  });
}

// connect two-way calling of actions
// the other half is in app.js
const ipcMain = require('electron').ipcMain;  // eslint-disable-line global-require import/no-unresolved
const handleActionOnMain = require('./app/ipc/handleActionOnMain');
ipcMain.on('call-action-on-main', (event, payload) => {
  log.debug('call-action-on-main', payload);
  handleActionOnMain(event, payload, soundApp);
});

// if (debug) {
//   require('electron-debug')({enabled: debug});  // eslint-disable-line global-require
// }

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  soundApp.stop();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1600,
    height: 1100,
    center: true
  });

  mainWindow.webContents.on('crashed', log.error);
  mainWindow.on('unresponsive', log.error);
  process.on('uncaughtException', log.error);
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled Rejection:', reason, reason && reason.stack);
  });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();

    soundApp.start(synthDefsDir)
      // .then(() => {
      //   log.debug('SoundApp started');
      // })
      .catch((error) => {
        log.error(error);
        throw error;
      });

    loadSounds(mainWindow);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.platform === 'darwin') {
    template = [{
      label: pkg.productName,
      submenu: [{
        label: 'About ' + pkg.productName,
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ' + pkg.productName,
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: debug ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.restart();
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal(pkg.author.url);
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: '&View',
      submenu: debug ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.restart();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal(pkg.author.url);
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
