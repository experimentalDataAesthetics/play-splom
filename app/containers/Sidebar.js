import React, { Component } from 'react';
import DatasetSelector from './DatasetSelector';
import LoopControl from '../components/LoopControl';
import SoundSelector from './SoundSelector';
import ParamMapping from './ParamMapping';
// import Help from './Help';
import styles from './Sidebar.css';
import connect from '../utils/reduxers';

import { getLayout } from '../selectors/index';

/**
 * The Sidebar container
 */
class Sidebar extends Component {
  render() {
    const { sideBarHeights } = this.props.layout;
    return (
      <aside className={styles.sidebar}>
        <DatasetSelector height={sideBarHeights.datasets} />
        <SoundSelector height={sideBarHeights.sounds} />
        <ParamMapping height={sideBarHeights.params} />
        <LoopControl height={sideBarHeights.loop} />
        {/* <Help /> */}
      </aside>
    );
  }
}

export default connect({
  layout: getLayout
})(Sidebar);
