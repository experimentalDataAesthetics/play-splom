import { Component } from 'react';
import h from 'react-hyperscript';

import DatasetSelector from './DatasetSelector';
import SoundSelector from './SoundSelector';
import ParamMapping from './ParamMapping';
import Help from './Help';
import LoopControl from '../components/LoopControl';
import styles from './Sidebar.css';

/**
 * The Sidebar container
 */
export default class Sidebar extends Component {
  render() {
    return h('aside',
      { className: styles.sidebar },
      [
        h(DatasetSelector),
        h(LoopControl),
        h(SoundSelector),
        h(ParamMapping),
        h(Help)
      ]);
  }
}
