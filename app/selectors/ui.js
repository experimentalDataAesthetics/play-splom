import { createSelector } from 'reselect';
import { centeredSquareWithMargin } from '../utils/layout';
import { getDatasetMetadata, getFeatures } from './dataset';
import { getLoop } from './sound';
import { OUTSIDE_MARGIN, MARGIN_BETWEEN_PLOTS, COLLAPSE, SIDEBAR_WIDTH } from '../constants';

export const getWindowSize = state => state.ui.windowSize;

export const getMuiTheme = state => state.ui.muiTheme;

// deprec
export const getNumFeatures = createSelector([getDatasetMetadata], dataset => {
  if (dataset) {
    return dataset.numFeatures;
  }

  return 0;
});

const getZoomed = state => state.ui.zoomed;

/**
 * Layout sizes and style depending on windowSize
 * and the dataset numFeatures
 * Will also include theme when that is added.
 */
export const getLayout = createSelector(
  [getWindowSize, getNumFeatures, getMuiTheme, getZoomed],
  (windowSize, numFeatures, muiTheme, zoomed) => {
    const layout = {};
    const big = windowSize.width > COLLAPSE;
    const sidebarWidth = big ? SIDEBAR_WIDTH : 0;
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
      const paramsHeight = 450;
      const loopHeight = 200;
      const others = windowSize.height - paramsHeight - loopHeight;
      const other = Math.max(others / 2, 115);
      layout.sideBarHeights = {
        params: `${paramsHeight}px`,
        loop: `${loopHeight}px`,
        datasets: `${other}px`,
        sounds: `${other}px`
      };
    }

    // console.log(muiTheme);
    layout.svgStyle = centeredSquareWithMargin(
      layout.svgWidth,
      windowSize.height,
      muiTheme.spacing.desktopGutter
    );
    layout.scatterPlotsMargin = OUTSIDE_MARGIN;
    layout.plotsWidth =
      layout.svgStyle.right - layout.svgStyle.left - 2 * layout.scatterPlotsMargin;

    layout.sideLength = layout.plotsWidth / (numFeatures || 1);
    layout.margin = layout.sideLength > 150 ? MARGIN_BETWEEN_PLOTS : 8;

    // Default: zoomed out all the way
    let zoom = {
      x: 0,
      y: 0,
      width: layout.svgStyle.width,
      height: layout.svgStyle.height
    };

    // each box
    layout.boxes = [];
    if (layout.sideLength > 0) {
      for (let m = 0; m < numFeatures; m += 1) {
        const x = m * layout.sideLength;
        for (let n = 0; n < numFeatures; n += 1) {
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

          // Set zoom
          if (zoomed && (m === zoomed.m && n === zoomed.n)) {
            zoom = {
              m,
              n,
              x: x + OUTSIDE_MARGIN - 15,
              y: y + OUTSIDE_MARGIN - 5,
              width: layout.sideLength,
              height: layout.sideLength
            };
          }
        }
      }
    }

    layout.zoom = zoom;

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
    return features.map(feature => {
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
export const getPointsForPlot = createSelector([getFeatureSideLengthScale], features => {
  return features.map(fs => {
    return {
      name: fs.feature.name,
      index: fs.feature.index,
      values: fs.feature.values.map(fs.mappedScale),
      yValues: fs.feature.values.map(fs.mappedScale)
    };
  });
});

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
      if (box) {
        return {
          x: box.x,
          y: box.y,
          width: layout.sideLength - layout.margin,
          height: layout.sideLength - layout.margin
        };
      }
    }
  }
);
