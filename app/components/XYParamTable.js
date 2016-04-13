
import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import MapButton from './MapButton';
import Slider from 'material-ui/lib/slider';
// http://react-components.com/component/react-slider
import ReactSlider from 'react-slider';
import style from './XYParamTable.css';

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
    const controls = this.props.sound.controls;
    const rows = controls.filter(modulateable)
      .map((control) => {
        const xcon = this.isConnected('x', control.name);
        const ycon = this.isConnected('y', control.name);
        const isConnected = xcon || ycon;
        let range;
        if (isConnected) {
          // get min max uni values
          // from mapping
          // get text values of actual from mapping
          // console.log(this.props.mapping);
          range = h(ReactSlider, {
            min: 0.0,
            max: 1.0,
            step: 0.01,
            minDistance: 0.1,
            defaultValue: [0.25, 0.7],
            pearling: true,
            withBars: true,
            className: style.rangeSlider,
            onAfterChange: (v) => console.log(v)
          }, [
            h('div', {className: style.rangeHandleMin}, [0.25]),
            h('div', {className: style.rangeHandleMax}, [0.75])
          ]);
        } else {
          // if controlspec staticspec staticintegerspec
          // if rate === 'control'
          console.log(control);
          range = h(Slider, {
            // defaultValue: 0.5
            // doesnt handle exp dB
            // value: control.spec.default,
            // min: control.spec.minval,
            // max: control.spec.maxval,
            // step: control.spec.step || 0.01
            // onChange
          });
        }

        return h('tr',
          {className: isConnected ? style.connected : style.fixed},
          [
            h('th', control.name),
            h('td', [
              h(MapButton, {
                isActive: xcon,
                action: () => this.props.mapXYtoParam('x', control.name)
              })
            ]),
            h('td', [
              h(MapButton, {
                isActive: ycon,
                action: () => this.props.mapXYtoParam('y', control.name)
              })
            ]),
            h('td', {className: style.range}, [range])
          ]);
      });

    return h('table', {className: style.table}, [
      h('thead', [
        h('tr', [
          h('th', ''),
          h('th', 'X'),
          h('th', 'Y'),
          h('th', '')
        ])
      ]),
      h('tbody', rows)
    ]);
  }
}
