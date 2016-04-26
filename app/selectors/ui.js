import { centeredSquare } from '../utils/layout';
import { createSelector } from 'reselect';
import { getDatasetMetadata, getFeatures } from './dataset';

export const getWindowSize = (state) => state.ui.windowSize;

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
 * Map each feature to sideLength
 * updating whenever the layout or dataset changes.
 */
export const getPointsForPlot = createSelector(
  [getFeatures, getLayout],
  (features, layout) => {
    return features.map((feature) => {
      const scale = feature.scale.range([0, layout.sideLength - layout.margin]);

      return {
        name: feature.name,
        index: feature.index,
        values: feature.values.map(scale)
      };
    });
  }
);
