/* eslint global-require: 0 */
import React, { Component, PropTypes } from 'react';
import styles from './App.css';


/**
 * App is the parent top level component which just wraps
 * the route and inserts DevTools.
 *
 * The route is standard in React apps (using react-router)
 * for switching between multiple pages / layouts
 * but in this case there is only one route: Main
*/
export default class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div className={styles.app}>
        {this.props.children}
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools');
              return <DevTools />;
            }
          })()
        }
      </div>
    );
  }
}
