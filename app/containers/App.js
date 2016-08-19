/* eslint global-require: 0 */
import React, { Component, PropTypes } from 'react';
import styles from './App.css';


/**
 * App is the parent top level component which just wraps
 * the route and inserts DevTools.
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
