
// Modules authored in this project are intended to be
// imported through new ES6 import syntax
// Node.js modules and those from npm
// are required using require()

const React = require('react');
const ReactDOM = require('react-dom');
const Provider = require('react-redux').Provider;
const ReactRouter = require('react-router');
// where does history come from ?
const createHashHistory = require('history').createHashHistory;

var h = require('react-hyperscript');

import configureStore from './store/configureStore';
import routes from './routes';

let qk = {queryKey: false};
const history = ReactRouter.useRouterHistory(createHashHistory)(qk);
const store = configureStore();

const ipc = require('electron').ipcRenderer;

// window.env contains data from config/env_XXX.json file.
// var envName = window.env.name;

document.addEventListener('DOMContentLoaded', () => {

  ReactDOM.render(
    // h('h1', 'hello'),
    h(Provider, {store}, [
      // h('h1', 'hello inner')
      h(ReactRouter.Router, {history, routes})
    ]),
    document.getElementById('content')
  );

});
