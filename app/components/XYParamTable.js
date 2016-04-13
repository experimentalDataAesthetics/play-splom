
import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import MapButton from './MapButton';

function modulateable(c) {
  return (c.name !== 'out') && (c.rate === 'control');
}

export default class XYParamTable extends React.Component {

  isConnected(xy, param) {
    if (!this.props.mapping) {
      return false;
    }

    return _.get(this.props.mapping, `xy.${xy}.param`) === param;
  }

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
}
