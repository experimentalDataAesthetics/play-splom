import d3 from 'd3';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { basename } from 'path';
import { getColumn } from 'data-projector';

export const getDataset = state => state.dataset;

export const getDatasetMetadata = createSelector([getDataset], dataset => {
  if (dataset) {
    return {
      name: basename(dataset.name),
      numFeatures: dataset.fields.length,
      columnNames: dataset.fields
    };
  }
});

/**
 * Dataset statistics that can be used as modulation sources.
 *
 * These are names: 'cor' 'covariance'
 * and x / y names: 'x-median' 'x-variance' 'y-median' 'y-variance'
 *
 * @type {Function}
 * @returns {Array.<string>}
 */
export const getSelectableSources = createSelector(
  [getDataset],
  dataset => (dataset ? sourcesFromStats(dataset.stats) : [])
);

export function pairwiseStatNames(pairwiseStats) {
  return _.keys(_.head(_.values(pairwiseStats)));
}

export function sourcesFromStats(stats) {
  const pairwise = pairwiseStatNames(stats.pairwise);
  const firstFieldKey = _.head(_.keys(stats.fields));
  const fieldStats = _.keys(stats.fields[firstFieldKey]);
  const fields = _.without(fieldStats, 'type', 'minval', 'maxval', 'linearRegression');
  const sources = [].concat(pairwise, _.map(fields, f => `x-${f}`), _.map(fields, f => `y-${f}`));
  return sources;
}

/**
 * Extract each column as values with min, max, mean, std calculated
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
export const getFeatures = createSelector([getDataset], dataset => {
  if (!dataset) {
    return [];
  }

  return dataset.fields.map((name, i) => {
    const data = getColumn(dataset, name);
    const fieldStats = dataset.stats.fields[name];
    const fieldType = fieldStats.type;

    const params = {
      name: name.trim(),
      index: i,
      values: data,
      typ: fieldType.type
    };

    function minMaxScale(scale) {
      return {
        min: fieldStats.minval,
        max: fieldStats.maxval,
        scale: scale.domain([fieldStats.minval, fieldStats.maxval]).nice()
      };
    }

    switch (fieldType.type) {
      case 'string': {
        const domain = Array.from(new Set(data));
        return _.assign(params, {
          domain,
          scale: d3.scale.ordinal().domain(domain)
        });
      }
      case 'enum': {
        const domain = fieldType.enum;
        return _.assign(params, {
          domain,
          scale: d3.scale.ordinal().domain(domain)
        });
      }
      case 'date':
        return _.assign(params, minMaxScale(d3.time.scale()));
      case 'number':
        return _.assign(params, minMaxScale(d3.scale.linear()), {
          mean: d3.mean(data),
          std: d3.deviation(data)
        });
      default:
        console.error(`Unmatched type: ${fieldType.type} for ${name}`);
        return params;
    }
  });
});

/**
 * Transform points in each feature to normalized unipolar points
 */
export const getNormalizedPoints = createSelector([getFeatures], features =>
  (features || []).map(normalizePoints)
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

    const isNumber = v => _.isNumber(v) && _.isFinite(v);
    // .domain(d3.extent(values)).nice()
    const normalize = v => {
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
