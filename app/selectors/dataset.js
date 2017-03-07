import d3 from 'd3';
import _ from 'lodash';
import { createSelector } from 'reselect';

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
 *
 * Each feature is an object:
 *  .name
 *  .index
 *  .values
 *  .typ
 *  .std
 *  .min
 *  .max
 *  .domain
 *  .scale - the appropriate scale (linear|ordinal|time) with domain set
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
        name: name.trim(),
        index: i,
        values: data
      };
      if (isString) {
        params.typ = 'string';
        params.domain = Array.from((new Set(data)));
        params.scale = d3.scale.ordinal().domain(params.domain);
        return params;
      }

      const extent = d3.extent(data);
      params.min = extent[0];
      params.max = extent[1];

      if (isDate) {
        params.typ = 'date';
        params.scale = d3.time.scale().domain(extent).nice();
        return params;
      }

      params.typ = 'number';
      params.mean = d3.mean(data);
      params.std = d3.deviation(data);
      params.scale = d3.scale.linear().domain(extent).nice();
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
      return (cv - feature.min) / range;

      // // normalize and clip it
      // const vvv = (cv - feature.mean) / (2 * feature.std);
      // if (vvv < 0) {
      //   return 0;
      // }
      //
      // if (vvv > 1) {
      //   return 1;
      // }
      //
      // return vvv;
    };

    scaledValues = feature.values.map(normalize);
  } else {
    scaledValues = feature.values.map(feature.scale.range([0, 1]));
  }

  return {
    name: feature.name,
    index: feature.index,
    values: scaledValues
  };
}
