/* eslint global-require: 0 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */
/**
 * The backend application that creates windows
 * and launches the frontend application app/index.js
 *
 * main.development.js is transpiled to main.js
 *
 * All module imports should use require, not import.
 * You can import from local files.
 *
 * The frontend and backend communicate using electron ipc
 */
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';

import {
  BrowserWindow,
  app,
  powerSaveBlocker,
  Menu,
  shell,
  ipcMain
} from 'electron';
import path from 'path';
// import winston from 'winston';
import SoundApp from './app/sound/SoundApp';
import { ERROR_ON_MAIN } from './app/actionTypes';
import handleActionOnMain from './app/ipc/handleActionOnMain';

const pkg = require('./package.json');

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

function errorOnMain(error) {
  console.error(error);
  console.error(error.stack);
  if (error.data) {
    console.error(error.data);
  }

  if (mainWindow) {
    mainWindow.webContents.send('dispatch-action', {
      type: ERROR_ON_MAIN,
      payload: {
        message: error.message,
        stack: error.stack,
        data: error.data
      }
    });
  }
}

function loadSounds(window) {
  const soundAppDispatch = (action) => {
    log.debug('dispatch-action', action);
    window.webContents.send('dispatch-action', action);
  };

  soundApp.loadSounds(synthDefsDir, soundAppDispatch).catch(errorOnMain);
  if (process.env.NODE_ENV === 'development') {
    soundApp.watchDir(synthDefsDir, soundAppDispatch);
  }
}

// Connect two-way calling of actions between renderer and main.
// The other half is in app/index.js
ipcMain.on('call-action-on-main', (event, payload) => {
  log.debug('call-action-on-main', payload);
  handleActionOnMain(event, payload, soundApp);
});

if (debug) {
  require('electron-debug')({showDevTools: true});
}

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

  process.on('uncaughtException', errorOnMain);
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled Rejection:', reason, reason && reason.stack);
    errorOnMain(reason);
  });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();

    soundApp.start(synthDefsDir)
      .then(() => {
        loadSounds(mainWindow);
      })
      .catch((error) => {
        console.error('SoundApp failed to start', error);
        // and maybe push it to the browser thread to notify user
        errorOnMain(error);
      });

  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.platform === 'darwin') {
    template = [{
      label: pkg.productName,
      submenu: [{
        label: `About ${pkg.productName}`,
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: `Hide ${pkg.productName}`,
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
