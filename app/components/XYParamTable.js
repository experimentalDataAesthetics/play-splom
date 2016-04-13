
import React from 'react';
import h from 'react-hyperscript';
import MapButton from './MapButton';
import Slider from 'material-ui/lib/slider';
// http://react-components.com/component/react-slider
import ReactSlider from 'react-slider';
import style from './XYParamTable.css';

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
          onAfterChange: (v) => console.log(v)
        }, [
          h('div',
            {className: style.rangeHandleMin},
            [control.natural.minval]),
          h('div',
            {className: style.rangeHandleMax},
            [control.natural.maxval])
        ]);

      } else {
        // if controlspec staticspec staticintegerspec
        // if rate === 'control'
        range = h(Slider, {
          defaultValue: control.unipolar.value,
          min: 0.0,
          max: 1.0,
          step: 0.01
          // onChange
        });
        // add a caption
      }

      return h('tr',
        {className: control.connected ? style.connected : style.fixed},
        [
          h('th', control.name),
          h('td', [
            h(MapButton, {
              isActive: control.xConnected,
              action: () => this.props.mapXYtoParam('x', control.name)
            })
          ]),
          h('td', [
            h(MapButton, {
              isActive: control.yConnected,
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
