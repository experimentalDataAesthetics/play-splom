import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import React from 'react';

import { loadDataset, openDatasetDialog } from '../actions/datasets';
import Select from '../components/Select';
import connect from '../utils/reduxers';
import styles from './Sidebar.css';

/**
 * Component in right sidebar to select from available
 * datasets or to click to open a dataset from the filesystem.
 */
class DatasetSelector extends React.PureComponent {
  static propTypes = {
    selected: PropTypes.string,
    datasets: PropTypes.array.isRequired,
    openDatasetDialog: PropTypes.func.isRequired,
    loadDataset: PropTypes.func.isRequired,
    height: PropTypes.string.isRequired
  };

  render() {
    const { datasets, selected, height } = this.props;
    const options = datasets.map(dataset => ({ label: dataset.name, value: dataset.path }));

    return (
      <div className={styles.datasetSelector} style={{ height }}>
        <h6>
          Datasets
          <span className={styles.datasetButton}>
            <RaisedButton label="Open..." onClick={this.props.openDatasetDialog} />
          </span>
        </h6>
        <Select
          height={parseInt(height, 10)}
          breakpoint={150}
          options={options}
          selected={selected}
          action={this.props.loadDataset}
        />
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
    loadDataset,
    openDatasetDialog
  }
)(DatasetSelector);
