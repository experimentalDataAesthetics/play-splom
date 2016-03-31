// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

// import modelNames from './menu';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

// var Menu = require('menu');
import SoundApp from './sound/SoundApp';
var soundApp = new SoundApp();

// connect two-way calling of actions
// the other half is in app.js
const ipcMain = require('electron').ipcMain;
import handleActionOnMain from './ipc/handleActionOnMain';
ipcMain.on('call-action-on-main', (event, payload) => {
  handleActionOnMain(event, payload, soundApp);
});

var mainWindow;
// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600
});

// function modelMenuItems() {
//   var items = [];
//   var i = 1;
//   _.each(modelNames, (name, key) => {
//     items.push({
//       label: name,
//       accelerator: 'Command+' + i,
//       click: function() {
//         BrowserWindow.getFocusedWindow()
//           .webContents.send('select-model', key);
//       }
//     });
//     i += 1;
//   });
//   items.push({
//     label: 'Play',
//     accelerator: 'Command+,',
//     click: function() {
//       BrowserWindow.getFocusedWindow()
//         .webContents.send('play');
//     }
//   });
//   items.push({
//     label: 'Stop',
//     accelerator: 'Command+.',
//     click: function() {
//       BrowserWindow.getFocusedWindow()
//         .webContents.send('stop');
//     }
//   });
//   return items;
// }
//
// function makeMenu() {
//   var template = [
//     {
//       label: 'Models of Self-Organization',
//       submenu: [
//         {
//           label: 'About Models of Self-Organization',
//           selector: 'orderFrontStandardAboutPanel:'
//         },
//         {
//           type: 'separator'
//         },
//         {
//           label: 'Services',
//           submenu: []
//         },
//         {
//           type: 'separator'
//         },
//         {
//           label: 'Hide Models of Self-Organization',
//           accelerator: 'Command+H',
//           selector: 'hide:'
//         },
//         {
//           label: 'Hide Others',
//           accelerator: 'Command+Shift+H',
//           selector: 'hideOtherApplications:'
//         },
//         {
//           label: 'Show All',
//           selector: 'unhideAllApplications:'
//         },
//         {
//           type: 'separator'
//         },
//         {
//           label: 'Quit',
//           accelerator: 'Command+Q',
//           click: function() { app.quit(); }
//         }
//       ]
//     },
//     {
//       label: 'Models',
//       submenu: modelMenuItems()
//     },
//     {
//       label: 'View',
//       submenu: [
//         {
//           label: 'Reload',
//           accelerator: 'Command+R',
//           click: function() {
//             BrowserWindow.getFocusedWindow()
//              .webContents.reloadIgnoringCache();
//           }
//         },
//         {
//           label: 'Toggle DevTools',
//           accelerator: 'Alt+Command+I',
//           click: function() {
//             BrowserWindow.getFocusedWindow()
//              .webContents.toggleDevTools();
//           }
//         }
//       ]
//     },
//     {
//       label: 'Window',
//       submenu: [
//         {
//           label: 'Minimize',
//           accelerator: 'Command+M',
//           selector: 'performMiniaturize:'
//         },
//         {
//           label: 'Close',
//           accelerator: 'Command+W',
//           selector: 'performClose:'
//         }
//       ]
//     }
//   ];
//
//   var menu = Menu.buildFromTemplate(template);
//
//   Menu.setApplicationMenu(menu);
// }

app.on('ready', function() {

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }

  if (env.name === 'test') {
    mainWindow.loadURL('file://' + __dirname + '/spec.html');
  } else {
    mainWindow.loadURL('file://' + __dirname + '/index.html');
  }

  if (env.name !== 'production') {
    devHelper.setDevMenu();
    mainWindow.openDevTools();
  }

  mainWindow.on('close', function() {
    mainWindowState.saveState(mainWindow);
  });

  // makeMenu();
  // mainWindow.webContents.reloadIgnoringCache();

  soundApp.start();
});

app.on('window-all-closed', function() {
  app.quit();
});

app.on('will-quit', function() {
  soundApp.stop();
});
