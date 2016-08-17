import { centeredSquareWithMargin } from '../utils/layout';
import { createSelector } from 'reselect';
import { getDatasetMetadata, getFeatures } from './dataset';
import { getLoop } from './sound';
import * as _ from 'lodash';

export const getWindowSize = (state) => state.ui.windowSize;

export const getMuiTheme = (state) => state.ui.muiTheme;

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
  [getWindowSize, getNumFeatures, getMuiTheme],
  (windowSize, numFeatures, muiTheme) => {
    const layout = {};
    const big = windowSize.width > 600;
    const sidebarWidth = big ? 300 : 0;
    layout.showSidebar = big;
    layout.svgWidth = windowSize.width - sidebarWidth;
    layout.margin = muiTheme.spacing.desktopGutterMini;

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

    // console.log(muiTheme);
    layout.svgStyle = centeredSquareWithMargin(layout.svgWidth, windowSize.height,
      muiTheme.spacing.desktopGutter);
    layout.scatterPlotsMargin = 60;
    layout.plotsWidth = (layout.svgStyle.right - layout.svgStyle.left)
      - (2 * layout.scatterPlotsMargin);

    layout.sideLength = layout.plotsWidth / (numFeatures || 1);

    // each box
    layout.boxes = [];
    if (layout.sideLength > 0) {
      for (let m = 0; m < numFeatures; m++) {
        const x = m * layout.sideLength;
        for (let n = 0; n < numFeatures; n++) {
          // identity
          // if (m === n) {
          //   continue;
          // }

          // const y = (n * layout.sideLength);
          // flip
          const y = (numFeatures - n - 1) * layout.sideLength;

          layout.boxes.push({
            m,
            n,
            x,
            y,
            baseClientX: x + layout.svgStyle.left + layout.scatterPlotsMargin,
            baseClientY: y + layout.svgStyle.top + layout.scatterPlotsMargin
          });
        }
      }
    }

    return layout;
  }
);

/**
 * Map each feature to sideLength
 * updating whenever the layout or dataset changes.
 */
export const getFeatureSideLengthScale = createSelector(
  [getFeatures, getLayout],
  (features, layout) => {
    const range = [0, layout.sideLength - layout.margin];
    // invertedRange for the SVG y axis
    const invertedRange = [layout.sideLength - layout.margin, 0];
    return features.map((feature) => {
      const mappedScale = feature.scale.copy().range(range);
      const invertedMappedScale = feature.scale.copy().range(invertedRange);
      return {
        feature,
        mappedScale,
        invertedMappedScale
      };
    });
  }
);

/**
 * Map each feature to sideLength
 * updating whenever the layout or dataset changes.
 *
 * For plotting y you need to invert it:
 * sideLength - y
 */
export const getPointsForPlot = createSelector(
  [getFeatureSideLengthScale],
  (features) => {
    return features.map((fs) => {
      return {
        name: fs.feature.name,
        index: fs.feature.index,
        values: fs.feature.values.map(fs.mappedScale),
        yValues: fs.feature.values.map(fs.mappedScale)
      };
    });
  }
);


/**
 * Selector that returns the rect of the box that is currently set to play loop.
 * Returns undefined if none is looping.
 * {x y width height}
 */
export const getLoopBox = createSelector(
  [getLayout, getNumFeatures, getLoop],
  (layout, numFeatures, loopMode) => {
    if (loopMode.box) {
      const box = layout.boxes[loopMode.box.m * numFeatures + loopMode.box.n];
      return {
        x: box.x,
        y: box.y,
        width: layout.sideLength - layout.margin,
        height: layout.sideLength - layout.margin
      };
    }
  }
);
