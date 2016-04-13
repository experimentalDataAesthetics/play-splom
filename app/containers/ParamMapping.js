import React from 'react';
import h from 'react-hyperscript';
import { connect } from 'react-redux';

import {
  getSound,
  getXYMappingControls
} from '../selectors/index';
import { mapXYtoParam } from '../actions/mapping';
import XYParamTable from '../components/XYParamTable';

const mapStateToProps = (state) => {
  return {
    sound: getSound(state),
    mapping: state.mapping,
    xyMappingControls: getXYMappingControls(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    mapXYtoParam: (xy, param) => {
      dispatch(mapXYtoParam(xy, param));
    }
  };
};

class ParamMapping extends React.Component {
  render() {
    return h('div',
      {className: this.props.className},
      [
        h('h6', this.props.sound ? this.props.sound.name : ''),
        h(XYParamTable, {
          sound: this.props.sound,
          mapping: this.props.mapping,
          xyMappingControls: this.props.xyMappingControls,
          mapXYtoParam: this.props.mapXYtoParam
        })
      ]);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParamMapping);
