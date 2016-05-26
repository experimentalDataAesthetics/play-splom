import React from 'react';
import h from 'react-hyperscript';
import { connect } from 'react-redux';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import { selectSound } from '../actions/sounds';

const SelectableList = MakeSelectable(List);

const mapStateToProps = (state) => {
  return {
    sounds: state.sounds,
    selectedSound: state.sound
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (event, name) => {
      dispatch(selectSound(name));
    }
  };
};

class SoundSelector extends React.Component {
  render() {
    return h('div.sound-selector', [
      h('h6', 'Sounds'),
      h(SelectableList,
        {
          value: this.props.selected,
          onChange: this.props.onSelect,
          className: 'selectable-list'
        },
        this.props.sounds.map((sound) => {
          return h(ListItem, {
            primaryText: sound.name,
            selected: sound.name === this.props.selectedSound,
            // selected: true,
            value: sound.name
          });
        })
      )
    ]);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SoundSelector);
