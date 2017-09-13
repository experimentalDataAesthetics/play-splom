import React from 'react';

import { selectSound } from '../actions/sounds';
import Select from '../components/Select';
import connect from '../utils/reduxers';
import styles from './Sidebar.css';

/**
 * Sidebar area for selecting the sound
 */
class SoundSelector extends React.PureComponent {
  render() {
    const { sounds, selectedSound, height } = this.props;
    const options = sounds.map(sound => ({ label: sound.name, value: sound.name }));

    return (
      <div className={styles.soundSelector} style={{ height }}>
        <h6>Sounds</h6>
        <Select
          height={parseInt(height, 10)}
          breakpoint={150}
          options={options}
          selected={selectedSound}
          action={this.props.selectSound}
        />
      </div>
    );
  }
}

export default connect(
  {
    sounds: 'sounds',
    selectedSound: 'sound'
  },
  {
    selectSound
  }
)(SoundSelector);
