import { round, scale } from 'd3';
import _ from 'lodash';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import React from 'react';
import InputRange from 'react-input-range';

import { setLoopTime, setLoopTimeDimension, toggleLoopMode } from '../actions/interaction';
import styles from '../containers/Sidebar.css';
import { getDatasetMetadata, getLoop } from '../selectors';
import connect from '../utils/reduxers';
import ToggleButton from './ToggleButton';
import style from './XYParamTable.css';

const MIN = 0.05;
const MAX = 60.0;
const MIN_LOOP_SPEED = 0.001 * 1000;
const MAX_LOOP_SPEED = 2.0 * 1000;
const mapv = scale
  .pow()
  .exponent(2)
  .range([MIN, MAX]);
const unmapv = mapv.invert;

/**
 * A toggle button to turn looping on and off,
 * and a slider to adjust loopTime.
 *
 */
class LoopControl extends React.PureComponent {
  static propTypes = {
    loopMode: PropTypes.object.isRequired,
    setLoopTime: PropTypes.func.isRequired,
    toggleLoopMode: PropTypes.func.isRequired
  };

  setLoopTime = _.debounce(v => {
    const loopTime = mapv(v);
    this.props.setLoopTime(loopTime);
  }, 100);

  setLoopSpeed = _.debounce(v => {
    const loopTime = _.clamp(1.0 / v * 1000, MIN_LOOP_SPEED, MAX_LOOP_SPEED);
    this.props.setLoopTime(loopTime);
  }, 100);

  render() {
    const loopTime = this.props.loopMode.loopTime || 10;
    const loopSpeed = _.clamp(1.0 / loopTime * 1000, MIN_LOOP_SPEED, MAX_LOOP_SPEED);

    const slider = (
      <InputRange
        minValue={0}
        maxValue={1}
        step={0.001}
        value={unmapv(loopTime)}
        onChange={this.setLoopTime}
        formatLabel={v => round(mapv(v), 2)}
        style={{ width: '256px' }} // to match the select box
      />
    );

    const numberInput = (
      <input
        type="number"
        value={loopSpeed}
        name="speed"
        min={MIN_LOOP_SPEED}
        max={MAX_LOOP_SPEED}
        step={1}
        onChange={e => this.setLoopSpeed(e.target.value)}
        style={{ width: '8rem' }}
      />
    );

    // has to initiate action with m,n
    // and toggle off with the last m,n
    // or make a different action
    const button = (
      <ToggleButton
        isActive={!!this.props.loopMode.box}
        action={() => this.props.toggleLoopMode()}
        iconActive="repeat"
        iconInactive="repeat"
      />
    );

    const timeColumns = this.props.dataSetMetadata
      ? this.props.dataSetMetadata.columnNames.map((name, i) => {
        return {
          value: i,
          label: name
        };
      })
      : [];

    const timeOptions = [
      {
        value: null,
        label: 'Index'
      },
      {
        value: 'x',
        label: 'x'
      }
    ].concat(timeColumns);

    const timeValue = this.props.loopMode.timeDimension;

    return (
      <div className={styles.loopControl}>
        <h6>Loop</h6>
        <table className={style.table}>
          <tbody>
            <tr>
              <th style={{ width: 100 }}>On</th>
              <td>{button}</td>
            </tr>
            <tr>
              <th style={{ verticalAlign: 'top' }}>Speed (mHz)</th>
              <td style={{ paddingBottom: '12px' }}>{numberInput}</td>
            </tr>
            <tr>
              <th>Time (seconds)</th>
              <td className={style.range}>{slider}</td>
            </tr>
            <tr>
              <th>Dimension</th>
              <td>
                <Select
                  value={timeValue}
                  set={value => this.props.setLoopTimeDimension(value)}
                  options={timeOptions}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function Select({ value, set, options }) {
  const onChange = (e, i, v) => set(selectToValue(v));
  return (
    <SelectField value={valueToSelect(value)} onChange={onChange}>
      {options.map(vl => (
        <MenuItem value={valueToSelect(vl.value)} primaryText={vl.label} key={vl.label} />
      ))}
    </SelectField>
  );
}

const X = 200;
const INDEX = 100;

function valueToSelect(v) {
  if (_.isNumber(v)) {
    return v;
  }
  if (v === 'x') {
    return X;
  }
  return INDEX;
}

function selectToValue(s) {
  switch (s) {
    case X:
      return 'x';
    case INDEX:
      return null;
    default:
      return s;
  }
}

export default connect(
  {
    loopMode: getLoop,
    dataSetMetadata: getDatasetMetadata
  },
  {
    setLoopTime,
    toggleLoopMode,
    setLoopTimeDimension
  }
)(LoopControl);
