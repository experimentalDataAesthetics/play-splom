import React from 'react';
import h from 'react-hyperscript';
import connect from '../utils/reduxers';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import { selectSound } from '../actions/sounds';

const SelectableList = MakeSelectable(List);

/**
 * Sidebar area for selecting the sound
 */
class SoundSelector extends React.Component {
  render() {
    return h('div.sound-selector', [
      h('h6', 'Sounds'),
      h(SelectableList,
        {
          value: this.props.selectedSound,
          onChange: this.props.onSelect,
          className: 'selectable-list'
        },
        this.props.sounds.map((sound) => {
          return h(ListItem, {
            primaryText: sound.name,
            selected: sound.name === this.props.selectedSound,
            style: {
              fontSize: '1em'
            },
            // selected: true,
            value: sound.name
          });
        })
      )
    ]);
  }
}

export default connect({
  sounds: 'sounds',
  selectedSound: 'sound'
}, {
  onSelect: (event, name) => selectSound(name)
})(SoundSelector);
