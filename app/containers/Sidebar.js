import React, { Component } from 'react';
import DatasetSelector from './DatasetSelector';
import LoopControl from '../components/LoopControl';
import SoundSelector from './SoundSelector';
import ParamMapping from './ParamMapping';
import Help from './Help';
import styles from './Sidebar.css';

/**
 * The Sidebar container
 */
export default class Sidebar extends Component {
  render() {
    return (
      <aside className={styles.sidebar}>
        <DatasetSelector />
        <SoundSelector />
        <LoopControl />
        <ParamMapping />
        <Help />
      </aside>
    );
  }
}
