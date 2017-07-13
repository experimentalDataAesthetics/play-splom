import React from 'react';
import _ from 'lodash';
import h from 'react-hyperscript';
import connect from '../utils/reduxers';
import XYParamTable from '../components/XYParamTable';
import styles from './Sidebar.css';

import { getSound, getXYMappingControls, getSelectableSources } from '../selectors/index';
import {
  mapXYtoParam,
  setFixedParamUnipolar,
  setParamRangeUnipolar,
  setSelectableSlot
} from '../actions/mapping';

const selectors = {
  sound: getSound,
  mapping: state => state.mapping,
  xyMappingControls: getXYMappingControls,
  selectableSources: getSelectableSources
};

const handlers = {
  mapXYtoParam,
  setFixedParamUnipolar,
  setParamRangeUnipolar,
  setSelectableSlot
};

/**
 * Sidebar component for mapping dataset features to sound parameters.
 *
 * The redux connection is established here and the current state
 * and handler functions are passed into the XYParamTable that does
 * the ui rendering.
 *
 * This is a standard React/Redux structure with dumb and smart components.
 * It does tend to increase the number of classes and code and increases
 * the amount of thought you have to do to find out what is doing what.
 * But it is a recommended coding style.
 */
class ParamMapping extends React.PureComponent {
  render() {
    return h(`div.${styles.paramMapping}`, [
      h('h6', this.props.sound ? this.props.sound.name : ''),
      h(
        XYParamTable,
        _.pick(this.props, [
          'sound',
          'mapping',
          'xyMappingControls',
          'selectableSources',
          'mapXYtoParam',
          'setFixedParamUnipolar',
          'setParamRangeUnipolar',
          'setSelectableSlot'
        ])
      )
    ]);
  }
}

export default connect(selectors, handlers)(ParamMapping);
