import React from 'react';
import h from 'react-hyperscript';
import InputRange from 'react-input-range';
import { map } from 'supercolliderjs';
import { round } from 'd3';
import ToggleButton from './ToggleButton';
// local css module import
// style object is unique hashed classnames
import style from './XYParamTable.css';

// app.global.css imports this globally
// otherwise it would be a css modeul import
// import 'react-input-range/lib/css/index.css';

/**
 * Editable params in the right sidebar of the app
 * to assign data -> sound parameter mappings and to adjust
 * the ranges of those mappings.
 */
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

    return (
      <table className={style.table}>
        <thead>
          <tr>
            <th />
            <th>X</th>
            <th>Y</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {this.props.xyMappingControls.map(control => (
            <XYParamRow
              key={control.name}
              control={control}
              setParamRangeUnipolar={this.props.setParamRangeUnipolar}
              setFixedParamUnipolar={this.props.setFixedParamUnipolar}
              mapXYtoParam={this.props.mapXYtoParam}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

class XYParamRow extends React.PureComponent {
  render() {
    const { control } = this.props;
    // console.log('render control', control);
    let onChange;
    let rangeValue;
    const fmt = v => {
      const u = map.mapWithSpec(v || 0, control.natural.spec);
      return round(u, u > 10 ? 0 : 2);
    };

    if (control.connected) {
      rangeValue = { min: control.unipolar.minval, max: control.unipolar.maxval };
      onChange = value => this.props.setParamRangeUnipolar(control.name, value.min, value.max);
    } else {
      onChange = v => this.props.setFixedParamUnipolar(control.name, v);
      rangeValue = control.unipolar.value || 0;
    }

    return h('tr', { className: control.connected ? style.connected : style.fixed }, [
      h('th', control.name),
      h('td', { className: style.pa0 }, [
        h(ToggleButton, {
          isActive: control.xConnected,
          action: () => this.props.mapXYtoParam('x', control.name),
          iconActive: 'radio_button_checked',
          iconInactive: 'radio_button_unchecked'
        })
      ]),
      h('td', { className: style.pa0 }, [
        h(ToggleButton, {
          isActive: control.yConnected,
          action: () => this.props.mapXYtoParam('y', control.name),
          iconActive: 'radio_button_checked',
          iconInactive: 'radio_button_unchecked'
        })
      ]),
      <td className={style.range}>
        <InputRange
          minValue={0}
          maxValue={1}
          step={0.001}
          value={rangeValue}
          onChange={onChange}
          formatLabel={fmt}
        />
      </td>
    ]);
  }
}
