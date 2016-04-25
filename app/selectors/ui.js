import { centeredSquare } from '../utils/layout';
import { createSelector } from 'reselect';
import { getDatasetMetadata, getNormalizedPoints } from './dataset';
import d3 from 'd3';

export const getWindowSize = (state) => {
  if (state.ui.windowSize) {
    return state.ui.windowSize;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

// deprec
export const getNumFeatures = createSelector(
  [getDatasetMetadata],
  (dataset) => {
    if (dataset) {
      return dataset.numFeatures;
    }

    return 0;
  }
);

/**
 * Layout sizes and style depending on windowSize
 * and the dataset numFeatures
 * Will also include theme when that is added.
 */
export const getLayout = createSelector(
  [getWindowSize, getNumFeatures],
  (windowSize, numFeatures) => {
    const layout = {};
    const big = windowSize.width > 600;
    const sidebarWidth = big ? 300 : 0;
    layout.showSidebar = big;
    layout.svgWidth = windowSize.width - sidebarWidth;
    layout.margin = 6;

    if (layout.showSidebar) {
      layout.sideBarStyle = {
        position: 'absolute',
        left: layout.svgWidth,
        right: windowSize.width,
        width: sidebarWidth,
        top: 0,
        bottom: windowSize.height
      };
    }

    layout.svgStyle = centeredSquare(layout.svgWidth, windowSize.height);
    layout.plotsWidth = layout.svgStyle.right - layout.svgStyle.left;

    layout.sideLength = layout.plotsWidth / (numFeatures || 1);
    return layout;
  }
);

/**
 * map each normalized feature to sideLength
 * updating whenever the layout or dataset changes
 */
export const getPointsForPlot = createSelector(
  [getNormalizedPoints, getLayout],
  (npoints, layout) => {
    const scaler = d3.scale.linear().domain([0, 1]).range([0, layout.sideLength - layout.margin]);
    return npoints.map((feature) => {
      return {
        name: feature.name,
        index: feature.index,
        values: feature.values.map(scaler)
      };
    });
  }
);
