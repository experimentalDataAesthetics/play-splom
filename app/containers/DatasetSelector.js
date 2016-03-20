const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;

import {loadDataset} from '../actions/datasets';

const mapStateToProps = (state) => {
  return {
    datasets: state.datasets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (path) => {
      dispatch(loadDataset(path));
    }
  };
};

class DatasetSelector extends React.Component {
  render() {
    return h('div.dataset-selector', [
      h('h6', 'Datasets'),
      h('ul.menu',
        this.props.datasets.map((dataset) => {
          return h('li', {
            onClick: this.props.onClick
          }, dataset.name);
        })
      )
    ]);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasetSelector);
