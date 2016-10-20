import React, { Component } from 'react';
import h from 'react-hyperscript';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import connect from '../utils/reduxers';
import styles from './Sidebar.css';
import {
  loadDataset,
  openDatasetDialog
} from '../actions/datasets';

const SelectableList = MakeSelectable(List);


/**
 * Component in right sidebar to select from available
 * datasets or to click to open a dataset from the filesystem.
 */
class DatasetSelector extends Component {

  static propTypes = {
    selected: React.PropTypes.bool.isRequired,
    datasets: React.PropTypes.array.isRequired,
    openDialog: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired
  };

  render() {
    return h(`div.dataset-selector.${styles.datasets}`, [
      h('h6', 'Datasets'),
      h(SelectableList,
        {
          value: this.props.selected,
          onChange: this.props.onSelect,
          className: 'selectable-list'
        },
        this.props.datasets.map((dataset) => {
          return h(ListItem, {
            primaryText: dataset.name,
            selected: true,
            value: dataset.path,
            style: {
              fontSize: '1em'
            }
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

export default connect(
  {
    datasets: 'datasets',
    selected: (state) => Boolean(state.dataset && state.dataset.path)
  },
  {
    onSelect: (e, path) => loadDataset(path),
    openDialog: openDatasetDialog
  })(DatasetSelector);
