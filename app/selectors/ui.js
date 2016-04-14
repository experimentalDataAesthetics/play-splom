import { centeredSquare } from '../utils/layout';
import { createSelector } from 'reselect';

const getDataset = (state) => state.dataset;

export const getWindowSize = (state) => {
  if (state.ui.windowSize) {
    return state.ui.windowSize;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

export const getNumFeatures = createSelector(
  [getDataset],
  (dataset) => {
    if (!dataset) {
      return 0;
    }

    return dataset.data.columnNames().length;
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

    layout.sideLength = layout.svgWidth / (numFeatures || 1);

    return layout;
  }
);
