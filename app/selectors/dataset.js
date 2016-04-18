import { autoScale } from '../utils/mapping';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import d3 from 'd3';

export const getDataset = (state) => state.dataset;

export const getDatasetMetadata = createSelector(
  [getDataset],
  (dataset) => {
    if (dataset) {
      const columnNames = dataset.data.columnNames();
      return {
        name: dataset.name,
        numFeatures: columnNames.length,
        columnNames
      };
    }
  }
);

/**
 * Extract each column as values with min, max, mean, std calculated
 * from a Miso dataset.
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
    const range = feature.max - feature.min;

    const isNumber = (v) => _.isNumber(v) && _.isFinite(v);
    // .domain(d3.extent(values)).nice()
    const normalize = (v) => {
      if (range === 0) {
        return 0.5;
      }
      // should actually reject this datapoint
      // for now just setting it to mean
      const cv = isNumber(v) ? v : feature.mean;

      // just scale it from min to max
      // return (cv - feature.min) / range;

      // normalize and clip it
      const vvv = (cv - feature.mean) / (2 * feature.std);
      if (vvv < 0) {
        return 0;
      }

      if (vvv > 1) {
        return 1;
      }

      return vvv;
    };

    scaledValues = feature.values.map(normalize);

  } else if (feature.typ === 'string') {
    const scale = d3.scale.ordinal().domain(feature.domain).range([0.05, 0.95]);
    scaledValues = feature.values.map(scale);
  } else if (feature.typ === 'date') {
    const scale = d3.time.scale()
        .domain(d3.extent([feature.min, feature.max])).nice()
        .range([0.05, 0.95]);
    scaledValues = feature.values.map(scale);
  } else {
    // wasted. may only be linear or empty set
    const scale = autoScale(feature.values, [feature.min, feature.max]);
    scaledValues = feature.values.map(scale);
  }

  return {
    name: feature.name,
    index: feature.index,
    values: scaledValues
  };
}
