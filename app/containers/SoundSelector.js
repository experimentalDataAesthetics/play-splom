const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;

import {selectSound} from '../actions/sounds';

const mapStateToProps = (state) => {
  return {
    sounds: state.sounds
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (name) => {
      dispatch(selectSound(name));
    }
  };
};

class SoundSelector extends React.Component {
  render() {
    return h('div.sound-selector', [
      h('h6', 'Sounds'),
      h('ul.menu',
        this.props.sounds.map((sound) => {
          return h('li', {
            onClick: this.props.onClick
          }, sound.name);
        })
      )
    ]);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SoundSelector);
