
const React = require('react');
const h = require('react-hyperscript');
const _ = require('lodash');

// requires the material-ui fonts in vendor
const FontIcon  = require('material-ui/lib/font-icon').default;
const IconButton = require('material-ui/lib/icon-button').default;
const Colors = require('material-ui/lib/styles/colors');

function modulateable(c) {
  return (c.name !== 'out') && (c.rate === 'control');
}

class MapButton extends React.Component {

  render() {
    return h(IconButton, {onClick: this.props.action}, [
      h(FontIcon, {
        className:'material-icons',
        color: this.props.isActive ? Colors.amber500 : Colors.lightWhite
      }, this.props.isActive ? 'radio_button_checked' : 'radio_button_unchecked')
    ]);
  }
}

export default class XYParamTable extends React.Component {
  render() {
    if (!this.props.sound) {
      return h('div.empty');
    }

    // material-ui buttons
    let rows = this.props.sound.controls
      .filter(modulateable)
      .map((control) => {
        return h('tr', [
          h('th', control.name),
          h('td', [
            h(MapButton, {
              isActive: this.isConnected('x', control.name),
              action: () => this.props.mapXYtoParam('x', control.name)
            })
          ]),
          h('td', [
            h(MapButton, {
              isActive: this.isConnected('y', control.name),
              action: () => this.props.mapXYtoParam('y', control.name)
            })
          ])
        ]);
      });

    return h('table.xy-param-table', [
      h('tbody', [
        h('tr', [
          h('th', ''),
          h('th', 'X'),
          h('th', 'Y')
        ])
      ].concat(rows))
    ]);
  }

  isConnected(xy, param) {
    if (!this.props.mapping) {
      return false;
    }

    return _.get(this.props.mapping, `xy.${xy}.param`) === param;
  }

}
