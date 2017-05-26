import React from 'react';
import PropTypes from 'prop-types';
import connect from '../utils/reduxers';
import ScatterPlots from '../components/ScatterPlots';
import ScatterPlotsActivePoints from '../components/ScatterPlotsActivePoints';
import ScatterPlotsInteractive from '../components/ScatterPlotsInteractive';
import HoveringAxis from '../components/HoveringAxis';
import LoopPlayHead from '../components/LoopPlayHead';

import { getPointsForPlot, getLayout, getDatasetMetadata } from '../selectors/index';

/**
 * This holds all of the plotting and interactive components for the Scatter Plots.
 *
 * Goes inside the SVG, adds a g which layers each of these on top of each other:
 * - ScatterPlots
 * - ScatterPlotsActivePoints
 * - LoopPlayHead
 * - ScatterPlotsInteractive
 *
 */
class ScatterPlotsContainer extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    dataset: PropTypes.object,
    features: PropTypes.array.isRequired,
    layout: PropTypes.object.isRequired
  };

  render() {
    const { dataset, features, layout } = this.props;
    const padding = layout.scatterPlotsMargin;

    const subProps = {
      height: this.props.height - padding * 2,
      width: this.props.width - padding * 2,
      dataset,
      features,
      layout
    };

    return (
      <g
        height={subProps.height}
        width={subProps.width}
        transform={`translate(${padding}, ${padding})`}
      >
        <ScatterPlots {...subProps} />
        <ScatterPlotsActivePoints />
        <LoopPlayHead />
        <HoveringAxis />
        <ScatterPlotsInteractive {...subProps} />
      </g>
    );
  }
}

export default connect({
  dataset: getDatasetMetadata,
  features: getPointsForPlot,
  layout: getLayout
})(ScatterPlotsContainer);
