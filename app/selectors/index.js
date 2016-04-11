const createSelector = require('reselect').createSelector;
const d3 = require('d3');
const _ = require('lodash');
const map = require('supercolliderjs').map;

const getDataset = (state) => state.dataset;
const getPointsUnderBrush = (state) => _.get(state, 'interaction.pointsUnderBrush', []);
const getPreviousPointsUnderBrush = (state) => _.get(state, 'interaction.previousPointsUnderBrush', []);
const getInteraction = (state) => state.interaction || {};
const getSoundName = (state) => state.sound;
const getSounds = (state) => state.sounds;
const getMapping = (state) => state.mapping || {};

import {autoScale} from '../utils/mapping';

export const getSound = createSelector(
  [getSoundName, getSounds],
  (soundName, sounds) => {
    for (let sound of sounds) {
      if (sound.name === soundName) {
        return sound;
      }
    }

    return null;
  }
);

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

/**
 * Normal function; not a selector.
 */
export const calcPointsEntering = (pointsUnderBrush, previousPointsUnderBrush) => {
  return _.difference(pointsUnderBrush || [], previousPointsUnderBrush || []);
};

function makeXYMapper(mapping, sound, param, xy) {
  if (param) {
    // a custom mapper is set (not yet implemented, always blank)
    let spec = _.get(mapping, `xy.${xy}.mapper`);
    if (!spec) {
      const control = _.find(sound.controls, { name: param });
      if (!control.spec) {
        // no spec so just return the defaultValue always
        if (control.defaultValue) {
          return function defaultValue() {
            return control.defaultValue;
          };
        } else {
          // no way to map this one
          // just guess with 0 though this can break things
          return function zero() {
            return 0;
          };
        }
      }

      spec = control.spec;
    }

    return makeMapper(spec);
  }
}

/**
 * A normal function; not a selector
 * Needs the full state
 */
export function spawnEventsFromBrush(state) {
  const pointsUnderBrush = getPointsUnderBrush(state) || [];
  const previousPointsUnderBrush = getPreviousPointsUnderBrush(state) || [];
  const pointsEntering = calcPointsEntering(pointsUnderBrush, previousPointsUnderBrush);
  const interaction = getInteraction(state);
  const npoints = getNormalizedPoints(state);

  return xyPointsEnteringToSynthEvents(pointsEntering,
    interaction.m,
    interaction.n,
    getSound(state),
    getMapping(state),
    npoints);
}

export function xyPointsEnteringToSynthEvents(pointsEntering, m, n, sound, mapping, npoints) {
  if (pointsEntering.length === 0) {
    return [];
  }

  if (!sound) {
    return [];
  }

  // these only change when mapping changes
  const paramX = _.get(mapping, 'xy.x.param');
  const paramY = _.get(mapping, 'xy.y.param');
  const mapperX = makeXYMapper(mapping, sound, paramX, 'x');
  const mapperY = makeXYMapper(mapping, sound, paramY, 'y');

  return pointsEntering.map((index) => {
    const x = npoints[m].values[index];
    const y = npoints[n].values[index];
    const args = {};
    if (paramX) {
      args[paramX] = mapperX(x);
    }

    if (paramY) {
      args[paramY] = mapperY(y);
    }

    return {
      defName: sound.name,
      args
    };
  });
}

export function makeMapper(spec) {
  switch (spec.warp) {
    case 'exp':
      return map.exp(spec);
    case 'db':
      return map.dB(spec);
    case 'amp':
      return map.fader(spec);
    default:
      return map.linear(spec);
  }
}
