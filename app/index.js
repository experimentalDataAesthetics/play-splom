import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import { join } from 'path';
import configureStore from './store/configureStore';
// import './stylesheets/main.less';
import './app.global.css';
import config from '../config';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// connect sound app etc

// don't need DOMContentLoaded anymore
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

// possibly just config.synthDefsDir
// as we will always be inside app now
const synthDefsDir = join(__dirname, '../', config.synthDefsDir);
store.dispatch(loadSounds(synthDefsDir));
