/* eslint global-require: 0 */
import React from 'react';
import styles from './App.css';

/**
 * App is the parent top level component which just wraps the main content.
*/
export default function App({ children }) {
  return (
    <div className={styles.app}>
      {children}
    </div>
  );
}
