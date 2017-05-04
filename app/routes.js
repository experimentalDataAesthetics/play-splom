import { Route, IndexRoute } from 'react-router';
import h from 'react-hyperscript';

import App from './containers/App';
import Main from './containers/Main';

/**
 * Every React app seems to have a Route handler
 * even if it isn't a webapp and doesn't have separate
 * scenes.
 *
 * Routes are like web URLs and allow you to switch
 * between Components for different scenes or pages.
 *
 * This only has one scene (for now) which is Main.
 *
 * App is the parent top level component which just wraps the route
 */
export default h(Route, { path: '/', component: App }, [
  h(IndexRoute, { component: Main }),
  h(Route, { status: 404, path: '*', component: Main })
]);
