import React from 'react';
import connect from '../utils/reduxers';
import { getLoop } from '../selectors';
import { toggleLoopMode, setLoopTime } from '../actions/interaction';
import { Slider } from 'material-ui';
import ToggleButton from './ToggleButton';
import { debounce } from 'lodash';
import d3 from 'd3';
import style from './XYParamTable.css';

const MIN = 0.1;
const MAX = 60.0;
const mapv = d3.scale.linear().domain([0, 1]).range([MIN, MAX]);
const unmapv = d3.scale.linear().domain([MIN, MAX]).range([0, 1]);


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
        onChange={debounce(sliderAction, 100)}
        sliderStyle={sliderStyle}
      />
    );

    // has to initiate action with m,n
    // and toggle off with the last m,n
    // or make a different action
    const button = (
      <ToggleButton
        isActive={Boolean(this.props.loopMode.box)}
        action={() => this.props.toggleLoopMode()}
        iconActive="repeat"
        iconInactive="repeat"
      />
    );

    return (
      <div className="loop-control">
        <table className={style.table}>
          <tbody>
            <tr>
              <th>Loop</th>
              <td>{button}</td>
              <td className={style.range}>{slider}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


export default connect({
  loopMode: getLoop
}, {
  setLoopTime,
  toggleLoopMode
})(LoopControl);
