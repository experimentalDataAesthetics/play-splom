import React from 'react';
import _ from 'lodash';
import h from 'react-hyperscript';
import InputRange from 'react-input-range';
import { map } from 'supercolliderjs';
import { round } from 'd3';
import ToggleButton from './ToggleButton';
// local css module import
// style object is unique hashed classnames
import style from './XYParamTable.css';
import { NUM_SELECTABLE_SOURCE_SLOTS } from '../constants';

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
      return <div className="empty" />;
    }

    // material-ui buttons
    /*
      from getXYMappingControls

      this.props.xyMappingControls
        name
        sources[]
          connected
          datasource
          slot
        unipolar
          value
          min
          max
        natural
          value
          min
          max
    */
    // these should be dynamic
    // clickable to select a source
    const selectableSlots = _.map(_.range(0, NUM_SELECTABLE_SOURCE_SLOTS), i =>
      <th key={`th${i}`}>{i}</th>
    );

    return (
      <table className={style.table}>
        <thead>
          <tr>
            <th />
            <th>X</th>
            <th>Y</th>
            {selectableSlots}
            <th />
          </tr>
        </thead>
        <tbody>
          {this.props.xyMappingControls.map(control =>
            (<XYParamRow
              key={control.name}
              control={control}
              setParamRangeUnipolar={this.props.setParamRangeUnipolar}
              setFixedParamUnipolar={this.props.setFixedParamUnipolar}
              mapXYtoParam={this.props.mapXYtoParam}
            />)
          )}
        </tbody>
      </table>
    );
  }
}

/**
 * Displays a sound parameter, radio buttons to connect the control sources,
 * and a range/value slider to adjust the mapping range of that connection.
 *
 * It is a range slider if the control is connected, else it is a single value
 * slider.
 *
 */
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

    const toggleConnected = (datasource, controlName) => () => {
      if (datasource) {
        this.props.mapXYtoParam(datasource, controlName);
      }
    };

    const buttons = control.sources.map(source =>
      (<td className={style.pa0} key={source.slot}>
        <ToggleButton
          isActive={source.connected}
          action={toggleConnected(source.datasource, control.name)}
          iconActive="radio_button_checked"
          iconInactive="radio_button_unchecked"
        />
      </td>)
    );

    return (
      <tr className={control.connected ? style.connected : style.fixed}>
        <th>{control.name}</th>
        {buttons}
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
      </tr>
    );
  }
}
