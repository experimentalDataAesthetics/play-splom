const React = require('react');
import h from 'react-hyperscript';
let connect = require('react-redux').connect;
import * as _ from 'lodash';

import ScatterPlot from '../components/ScatterPlot';
import {
  showBrush,
  setPointsUnderBrush,
  toggleLoopMode
} from '../actions/interaction';
import {
  getPointsForPlot,
  getLayout,
  getNumFeatures
} from '../selectors/index';

const mapStateToProps = (state) => {
  return {
    dataset: state.dataset,
    features: getPointsForPlot(state),
    layout: getLayout(state),
    numFeatures: getNumFeatures(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showBrush: (show, clientX, clientY) => {
      dispatch(showBrush(show, clientX, clientY));
    },

    setPointsUnderBrush: (m, n, indices) => {
      dispatch(setPointsUnderBrush(m, n, indices));
    },

    toggleLoopMode: (m, n) => {
      dispatch(toggleLoopMode(m, n));
    }
  };
};

const margin = 6;  // get from theme

class ScatterPlots extends React.Component {

  render() {
    let children = [];

    if (this.props.dataset) {
      let title = h('text', {
        x: 50,
        y: 50,
        className: 'dataset-title'
        // transform: 'rotate(90)'
      }, [this.props.dataset.name]);
      children.push(title);

      const sideLength = this.props.layout.sideLength;
      const columnNames = this.props.dataset.data.columnNames();

      if (sideLength > 0) {
        for (let m = 0; m < this.props.numFeatures; m++) {
          const x = m * sideLength;
          for (let n = 0; n < this.props.numFeatures; n++) {
            if (m >= n) {
              continue;
            }

            let y = n * sideLength;
            let plotKey = `${m}@${n}`;
            let xName = columnNames[m];
            let yName = columnNames[n];

            const featx = this.props.features[m].values;
            const featy = this.props.features[n].values;
            let points = _.zip(featx, featy);

            const sp = h(ScatterPlot, {
              points,
              m,
              n,
              xName,
              yName,
              plotKey,
              xOffset: x + margin,
              yOffset: y + margin,
              sideLength: sideLength - margin,
              showBrush: this.props.showBrush,
              setPointsUnderBrush: this.props.setPointsUnderBrush,
              toggleLoopMode: this.props.toggleLoopMode
            });

            children.push(sp);
          }
        }
      }
    }

    return h(
      'g',
      {
        height: this.props.height,
        width: this.props.width,
        className: 'scatterplots'
      },
      children
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlots);
