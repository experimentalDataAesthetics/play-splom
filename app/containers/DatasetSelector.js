import { Component } from 'react';
import h from 'react-hyperscript';

import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
const SelectableList = MakeSelectable(List);

import {
  loadDataset,
  openDatasetDialog
} from '../actions/datasets';

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

class DatasetSelector extends Component {
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
        this.props.datasets.map((dataset) => {
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
