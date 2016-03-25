const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;
let RaisedButton = require('material-ui/lib/raised-button').default;

let List = require('material-ui/lib/lists/list').default;
let ListItem = require('material-ui/lib/lists/list-item').default;
let SelectableContainerEnhance = require('material-ui/lib/hoc/selectable-enhance').default;
let SelectableList = SelectableContainerEnhance(List);

import {loadDataset, openDatasetDialog} from '../actions/datasets';

const mapStateToProps = (state) => {
  return {
    datasets: state.datasets,
    selected: state.dataset && state.dataset.path
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (e, path) => {
      dispatch(loadDataset(path));
    },

    openDialog: () => {
      dispatch(openDatasetDialog());
    }
  };
};

class DatasetSelector extends React.Component {
  render() {
    return h('div.dataset-selector', [
      h('h6', 'Datasets'),
      h(SelectableList,
        {
          valueLink: {
            value: this.props.selected,
            requestChange: this.props.onSelect
          },
          className: 'selectable-list'
        },
        this.props.datasets.map((dataset, i) => {
          return h(ListItem, {
            primaryText: dataset.name,
            selected: true,
            value: dataset.path
          });
        })
      ),
      h(RaisedButton, {
        label: 'Open...',
        style: {float: 'right'},
        onTouchTap: this.props.openDialog
      })
    ]);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasetSelector);
