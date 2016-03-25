const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;
let Dimensions = require('react-dimensions');

import ScatterPlot from '../components/ScatterPlot';

const mapStateToProps = (state) => {
  return {
    dataset: state.dataset
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onSelect: (e, path) => {
    //   dispatch(loadDataset(path));
    // },
    //
    // openDialog: () => {
    //   dispatch(openDatasetDialog());
    // }
  };
};

class ScatterPlots extends React.Component {

  render() {
    let children = [];

    if (this.props.dataset) {
      let title = h('text', {
        x: 100,
        y: 100
        // transform: 'rotate(90)'
      }, [this.props.dataset.name]);
      children.push(title);

      let columnNames = this.props.dataset.data.columnNames();
      let numFeatures = columnNames.length;

      let sideLength = this.props.containerWidth / numFeatures;
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
            xOffset: x,
            yOffset: y,
            sideLength: sideLength
          });

          children.push(sp);
        }
      }
    }

    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        className: 'scatterplots',
        height: this.props.containerHeight,
        width: this.props.containerWidth
      },
      children
    );
  }
}

let DimScatterPlots =  Dimensions()(ScatterPlots);

export default connect(mapStateToProps, mapDispatchToProps)(DimScatterPlots);
