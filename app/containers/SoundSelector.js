const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;

let List = require('material-ui/lib/lists/list').default;
let ListItem = require('material-ui/lib/lists/list-item').default;
let SelectableContainerEnhance = require('material-ui/lib/hoc/selectable-enhance').default;
let SelectableList = SelectableContainerEnhance(List);

import {selectSound} from '../actions/sounds';

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
          valueLink: {
            value: this.props.selected,
            requestChange: this.props.onSelect
          },
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
