import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import _ from 'lodash';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import connect from '../utils/reduxers';
import { getLoop, getDatasetMetadata } from '../selectors';
import { toggleLoopMode, setLoopTime, setLoopTimeDimension } from '../actions/interaction';
import ToggleButton from './ToggleButton';
import style from './XYParamTable.css';
import styles from '../containers/Sidebar.css';

const MIN = 0.05;
const MAX = 60.0;
const mapv = d3.scale.pow().exponent(2).range([MIN, MAX]);
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

  setLoopTime = _.debounce((e, v) => {
    this.props.setLoopTime(mapv(1 - v));
  }, 100);

  render() {
    const sliderStyle = {
      marginTop: 4,
      marginBottom: 4
    };

    const slider = (
      <Slider
        defaultValue={1 - unmapv(this.props.loopMode.loopTime || 10)}
        min={0}
        max={1}
        step={0.01}
        onChange={this.setLoopTime}
        sliderStyle={sliderStyle}
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
        <table className={style.table}>
          <tbody>
            <tr>
              <th>Loop</th>
              <td>{button}</td>
            </tr>
            <tr>
              <th>Speed</th>
              <td className={style.range}>{slider}</td>
            </tr>
            <tr>
              <th>Time Dimension</th>
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
  if (_.isNumber) {
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
