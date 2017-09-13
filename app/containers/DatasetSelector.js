import React from 'react';
import PropTypes from 'prop-types';
import h from 'react-hyperscript';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import connect from '../utils/reduxers';
import styles from './Sidebar.css';
import { loadDataset, openDatasetDialog } from '../actions/datasets';

const SelectableList = MakeSelectable(List);

/**
 * Component in right sidebar to select from available
 * datasets or to click to open a dataset from the filesystem.
 */
class DatasetSelector extends React.PureComponent {
  static propTypes = {
    selected: PropTypes.string,
    datasets: PropTypes.array.isRequired,
    openDialog: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    height: PropTypes.string.isRequired
  };

  render() {
    const selectableList = h(
      SelectableList,
      {
        value: this.props.selected,
        onChange: this.props.onSelect,
        className: 'selectable-list',
        style: { clear: 'both' }
      },
      this.props.datasets.map(dataset => {
        return h(ListItem, {
          primaryText: dataset.name,
          value: dataset.path,
          selected: dataset.name === this.props.selected,
          style: {
            fontSize: '1em'
          },
          innerDivStyle: {
            padding: '8px'
          }
        });
      })
    );

    return (
      <div className={styles.datasetSelector} style={{ height: this.props.height }}>
        <h6>
          Datasets
          <span className={styles.datasetButton}>
            <RaisedButton label="Open..." onClick={this.props.openDialog} />
          </span>
        </h6>
        {selectableList}
      </div>
    );
  }
}

export default connect(
  {
    datasets: 'datasets',
    selected: state => state.dataset && state.dataset.path
  },
  {
    onSelect: (e, path) => loadDataset(path),
    openDialog: openDatasetDialog
  }
)(DatasetSelector);
