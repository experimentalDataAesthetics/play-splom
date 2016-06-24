
import React from 'react';
import h from 'react-hyperscript';
import MapButton from './MapButton';
import { Slider } from 'material-ui';
import ReactSlider from 'react-slider';
import style from './XYParamTable.css';
import { round } from 'd3';
import { debounce } from 'lodash';

// const round = format('g');

export default class XYParamTable extends React.Component {

  render() {
    if (!this.props.sound) {
      return h('div.empty');
    }

    // material-ui buttons
    /*
      this.props.xyMappingControls
        name
        xConnected
        yConnected
        connected
        unipolar
          value
          min
          max
        natural
          value
          min
          max
    */
    const rows = this.props.xyMappingControls.map((control) => {
      let range;
      if (control.connected) {
        // get min max uni values
        // from mapping
        // get text values of actual from mapping
        range = h(ReactSlider, {
          min: 0.0,
          max: 1.0,
          step: 0.01,
          minDistance: 0.1,
          defaultValue: [
            control.unipolar.minval,
            control.unipolar.maxval
          ],
          pearling: true,
          withBars: true,
          className: style.rangeSlider,
          onAfterChange: (v) => this.props.setParamRangeUnipolar(control.name, v[0], v[1])
        }, [
          h('div',
            {className: style.rangeHandleMin},
            [round(control.natural.minval)]),
          h('div',
            {className: style.rangeHandleMax},
            [round(control.natural.maxval)])
        ]);

      } else {
        const sliderAction = (e, v) => this.props.setFixedParamUnipolar(control.name, v);
        range = h(Slider, {
          defaultValue: control.unipolar.value,
          min: 0.0,
          max: 1.0,
          step: 0.001,
          onChange: debounce(sliderAction, 300)
        });
      }

      return h('tr',
        {className: control.connected ? style.connected : style.fixed},
        [
          h('th', control.name),
          h('td',
            {className: style.pa0},
            [
              h(MapButton, {
                isActive: control.xConnected,
                action: () => this.props.mapXYtoParam('x', control.name)
              })
            ]),
          h('td',
            {className: style.pa0},
            [
              h(MapButton, {
                isActive: control.yConnected,
                action: () => this.props.mapXYtoParam('y', control.name)
              })
            ]),
          h('td',
            {className: style.range},
            [range])
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
