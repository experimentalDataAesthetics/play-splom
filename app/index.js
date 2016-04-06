import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
// import './stylesheets/main.less';
import './app.global.css';

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
