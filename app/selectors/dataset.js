import { autoScale } from '../utils/mapping';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import d3 from 'd3';
import { getLayout } from './ui';

const getDataset = (state) => state.dataset;

/**
 * Extract each column as values with min, max, mean, std calculated
 */
export const getFeatures = createSelector(
  [getDataset],
  (dataset) => {
    if (!dataset) {
      return [];
    }

    return dataset.data.columnNames().map((name, i) => {
      const data = dataset.data.column(name).data;
      const first = data[0];
      const isDate = _.isDate(first);
      const isString = _.isString(first);
      const params = {
        name,
        index: i,
        values: data
      };
      if (isString) {
        params.typ = 'string';
        params.domain = Array.from((new Set(data)));
        return params;
      }

      const extent = d3.extent(data);
      params.min = extent[0];
      params.max = extent[1];

      if (isDate) {
        params.typ = 'date';
        return params;
      }

      params.typ = 'number';
      params.mean = d3.mean(data);
      params.std = d3.deviation(data);
      return params;
    });
  }
);

/**
 * Transform points in each feature to normalized unipolar points
 */
export const getNormalizedPoints = createSelector(
  [getFeatures],
  (features) => (features || []).map(normalizePoints)
);

/**
 * normalize each feature to 0..1
 */
export function normalizePoints(feature) {
  let scaledValues;
  if (feature.typ === 'number') {
    // subtract mean
    // divide by range
    // or:
    //  divide by std
    //  clip
    let range = feature.max - feature.min;
    if (range === 0) {
      range = 1;
    }

    const isNumber = (v) => _.isNumber(v) && _.isFinite(v);
    const normalize = (v) => ((isNumber(v) ? v : feature.mean) - feature.mean) / range + 0.5;
    scaledValues = feature.values.map(normalize);
  } else {
    // this handles dates and ordinal/class/categories
    const scale = autoScale(feature.values);
    scaledValues = feature.values.map(scale);
  }

  return {
    name: feature.name,
    index: feature.index,
    values: scaledValues
  };
}

export const getPointsForPlot = createSelector(
  [getNormalizedPoints, getLayout],
  (npoints, layout) => {
    const scaler = d3.scale.linear().domain([0, 1]).range([0, layout.sideLength]);
    return npoints.map((feature) => {
      return {
        name: feature.name,
        index: feature.index,
        values: feature.values.map(scaler)
      };
    });
  }
);
