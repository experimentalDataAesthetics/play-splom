import React from 'react';
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
class LoopControl extends React.Component {
  static propTypes = {
    loopMode: React.PropTypes.object.isRequired,
    setLoopTime: React.PropTypes.func.isRequired,
    toggleLoopMode: React.PropTypes.func.isRequired
  };

  render() {
    const sliderAction = (e, v) => {
      this.props.setLoopTime(mapv(1 - v));
    };

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
        onChange={_.debounce(sliderAction, 100)}
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

    const timeOptions = [
      {
        value: -1,
        label: 'Index'
      }
    ].concat(
      this.props.dataSetMetadata.columnNames.map((name, i) => {
        return {
          value: i,
          label: name
        };
      })
    );
    const timeValue = this.props.loopMode.timeDimension;

    return (
      <div className={styles.loopControl}>
        <table className={style.table}>
          <tbody>
            <tr>
              <th>Loop</th>
              <td>{button}</td>
              <td className={style.range}>{slider}</td>
            </tr>
            <tr>
              <th />
              <td>
                <Select
                  value={_.isNumber(timeValue) ? timeValue : -1}
                  set={value => {
                    this.props.setLoopTimeDimension(value === -1 ? null : value);
                  }}
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
  const onChange = (e, i, v) => set(v);
  return (
    <SelectField floatingLabelText="Time Axis" value={value} onChange={onChange}>
      {options.map(vl => <MenuItem value={vl.value} primaryText={vl.label} key={vl.label} />)}
    </SelectField>
  );
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
