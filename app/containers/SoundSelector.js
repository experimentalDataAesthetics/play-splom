import React from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import connect from '../utils/reduxers';
import { selectSound } from '../actions/sounds';
import styles from './Sidebar.css';

const SelectableList = MakeSelectable(List);

/**
 * Sidebar area for selecting the sound
 */
function SoundSelector({ sounds, selectedSound, onSelect }) {
  return (
    <div className={styles.soundSelector}>
      <h6>Sounds</h6>
      <SelectableList value={selectedSound} onChange={onSelect} className="selectable-list">
        {sounds.map(sound => (
          <ListItem
            key={sound.name}
            primaryText={sound.name}
            selected={sound.name === selectedSound}
            style={{
              fontSize: '1em'
            }}
            innerDivStyle={{
              padding: '8px'
            }}
            value={sound.name}
          />
        ))}
      </SelectableList>
    </div>
  );
}

export default connect(
  {
    sounds: 'sounds',
    selectedSound: 'sound'
  },
  {
    onSelect: (event, name) => selectSound(name)
  }
)(SoundSelector);
