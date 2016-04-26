import React from 'react';
import h from 'react-hyperscript';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
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

const mapStateToProps = createSelector(
  [getSound, (state) => state.mapping, getXYMappingControls],
  (sound, mapping, xyMappingControls) => ({sound, mapping, xyMappingControls}));

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({mapXYtoParam, setFixedParamUnipolar, setParamRangeUnipolar}, dispatch);
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

export default connect(mapStateToProps, mapDispatchToProps)(ParamMapping);
