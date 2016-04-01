const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;

import ScatterPlot from '../components/ScatterPlot';
import {showBrush, setPointsUnderBrush} from '../actions/interaction';

const mapStateToProps = (state) => {
  return {
    dataset: state.dataset
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showBrush: (show, clientX, clientY) => {
      dispatch(showBrush(show, clientX, clientY));
    },

    setPointsUnderBrush: (m, n, indices) => {
      dispatch(setPointsUnderBrush(m, n, indices));
    }
  };
};

const margin = 6;  // get from theme
const bottomPadding = 20;

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

      let columnNames = this.props.dataset.data.columnNames();
      let numFeatures = columnNames.length;

      let sideLength = (this.props.width - bottomPadding) / numFeatures;
      for (let m = 0; m < numFeatures; m++) {
        let x = m * sideLength;
        for (let n = 0; n < numFeatures; n++) {
          if (m >= n) {
            continue;
          }

          let y = n * sideLength;
          let plotKey = `${m}@${n}`;
          let xName = columnNames[m];
          let yName = columnNames[n];

          let sp = h(ScatterPlot, {
            dataset: this.props.dataset.data,
            m: m,
            n: n,
            xName: xName,
            yName: yName,
            plotKey: plotKey,
            xOffset: x + margin,
            yOffset: y + margin,
            sideLength: sideLength - margin,
            showBrush: this.props.showBrush,
            setPointsUnderBrush: this.props.setPointsUnderBrush
          });

          children.push(sp);
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
