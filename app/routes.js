
const React = require('react');
const reactRouter = require('react-router');
var {Route, IndexRoute} = reactRouter;

const h = require('react-hyperscript');

/* containers */
import App from './containers/App';
import Main from './containers/Main';

export default h(Route, {path: '/', component: App}, [
  h(IndexRoute, {component: Main}),
  h(Route, {status: 404, path: '*', component: Main})
]);
