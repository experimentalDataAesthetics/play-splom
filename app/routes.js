
import { Route, IndexRoute } from 'react-router';
import h from 'react-hyperscript';

import App from './containers/App';
import Main from './containers/Main';

export default h(Route, {path: '/', component: App}, [
  h(IndexRoute, {component: Main}),
  h(Route, {status: 404, path: '*', component: Main})
]);
