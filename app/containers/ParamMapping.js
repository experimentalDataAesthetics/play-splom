import React from 'react';
import h from 'react-hyperscript';
import connect from '../utils/reduxers';
import XYParamTable from '../components/XYParamTable';
import { pick } from 'lodash';

import {
  getSound,
  getXYMappingControls
} from '../selectors/index';
import {
  mapXYtoParam,
  setFixedParamUnipolar,
  setParamRangeUnipolar
} from '../actions/mapping';

const selectors = {
  sound: getSound,
  mapping: (state) => state.mapping,
  xyMappingControls: getXYMappingControls
};

const handlers = {
  mapXYtoParam,
  setFixedParamUnipolar,
  setParamRangeUnipolar
};

class ParamMapping extends React.Component {
  render() {
    return h('div',
      {className: this.props.className},
      [
        h('h6', this.props.sound ? this.props.sound.name : ''),
        h(XYParamTable,
          pick(this.props, [
            'sound',
            'mapping',
            'xyMappingControls',
            'mapXYtoParam',
            'setFixedParamUnipolar',
            'setParamRangeUnipolar'
          ]))
      ]);
  }
}

export default connect(selectors, handlers)(ParamMapping);
