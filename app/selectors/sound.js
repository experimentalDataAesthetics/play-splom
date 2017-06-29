import d3 from 'd3';
import { map } from 'supercolliderjs';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { getNormalizedPoints, getDataset, pairwiseStatNames } from './dataset';
import { NUM_SELECTABLE_SOURCE_SLOTS } from '../constants';

export const getPointsUnderBrush = state => _.get(state, 'interaction.pointsUnderBrush', []);
const getPreviousPointsUnderBrush = state =>
  _.get(state, 'interaction.previousPointsUnderBrush', []);
const getInteraction = state => state.interaction || {};
const getSoundName = state => state.sound;
const getSounds = state => state.sounds;
const getMapping = state => state.mapping || {};

export const getLoop = state => _.get(state, 'interaction.loopMode', {});

export const getSound = createSelector([getSoundName, getSounds], (soundName, sounds) => {
  for (const sound of sounds) {
    if (sound.name === soundName) {
      return sound;
    }
  }

  return null;
});

/**
 * min max accumulator
 */
const mm = (prev, num) => {
  const p = prev || { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
  return {
    min: Math.min(p.min, num),
    max: Math.max(p.max, num)
  };
};

/**
 * A statistics lookup table accessed by the name of the statistic
 * and the m / n box coordinate.
 *
 * All values in the table are normalized to 0..1
 *
 * This is for fast usage in mapping
 *
 *  median
 *    0
 *    1
 *  cor
 *    2@3
 *    3@2
 *
 * @type {Function}
 */
export const statsTable = createSelector([getDataset], dataset => {
  return _statsTable(dataset.stats, dataset.fields);
});

export function _statsTable(stats, fields) {
  const table = {};
  const minmax = pairwiseMinMax(stats.pairwise);
  pairwiseStatNames(stats.pairwise).forEach(statName => {
    table[statName] = {};
    fields.forEach((f1, m) => {
      fields.forEach((f2, n) => {
        const key = `${m}@${n}`;
        const value = stats.pairwise[f1][statName][f2];
        // scale it between min max
        const scale = d3.scale.linear().domain([minmax[statName].min, minmax[statName].max]);
        table[statName][key] = _.isNumber(value) ? scale(value) : 0.5;
      });
    });
  });

  return table;
}

/**
 * Given dataset.stats.pairwise, determine the min/max of all
 * valid numbers in the m@n pairs.
 *
 * {
 *   cor: { min: -0.25867046096413593, max: 0.9009311952825864 },
 *   corRank: { min: -0.3519565217391305, max: 0.3052173913043478 }
 * }
 */
export function pairwiseMinMax(pairwise) {
  const minmax = {};
  _.forEach(pairwise, crossStats => {
    _.forEach(crossStats, (statCrossValues, statName) => {
      _.forEach(statCrossValues, num => {
        if (_.isNumber(num)) {
          minmax[statName] = mm(minmax[statName], num);
        }
      });
    });
  });
  return minmax;
}

/**
 * getXYMappingControls - Generates an object for each modulateable control of the current sound.
 *
 * used by XYParamTable
 *
 * Each object contains:
 *
 *   name
 *   sources[]
 *    connected: boolean
 *    datasource: x y x.cor etc
 *    slot: x y 0 1 2 3
 *   unipolar
 *     value
 *     minval
 *     maxval
 *   natural
 *     value
 *     minval
 *     maxval
 *
 * @return {Function} A reselect selector
 */
export const getXYMappingControls = createSelector([getMapping, getSound], xyMappingControls);

export function xyMappingControls(mapping, sound) {
  if (!sound) {
    return [];
  }

  const modulateable = c => c.name !== 'out' && c.spec;
  const selectableSlots = _.get(mapping, 'xy.selectableSlots', {});

  const isConnected = (xy, param) => {
    if (!(mapping && xy)) {
      return false;
    }

    return Boolean(_.get(mapping, `xy.${xy}.params.${param}`));
  };

  const findDefault = control => {
    const dv = _.find([control.defaultValue, control.spec.defaultValue], _.isNumber);
    if (_.isUndefined(dv)) {
      return 0.5;
    }

    return map.unmapWithSpec(dv, control.spec);
  };

  return sound.controls.filter(modulateable).map(control => {
    const spec = control.spec;

    const slots = _.range(0, NUM_SELECTABLE_SOURCE_SLOTS).map(i => {
      const slot = String(i);
      const datasource = selectableSlots[slot];
      return {
        slot,
        datasource,
        connected: isConnected(datasource, control.name)
      };
    });

    const sources = [
      {
        slot: 'x',
        datasource: 'x',
        connected: isConnected('x', control.name)
      },
      {
        slot: 'y',
        datasource: 'y',
        connected: isConnected('y', control.name)
      }
    ].concat(slots);

    // value should be unmapped defaultValue
    const unipolar = _.assign(
      {
        value: _.clamp(findDefault(control), 0, 1),
        minval: 0.0,
        maxval: 1.0
      },
      _.get(mapping, `unipolarMappingRanges.${control.name}`)
    );

    // natural is mapping those three
    const natural = _.mapValues(unipolar, v => map.mapWithSpec(v, spec));
    natural.spec = {
      warp: spec.warp,
      step: spec.step,
      minval: natural.minval,
      maxval: natural.maxval
    };

    // defaultValue can be wonky due to floating point math
    // eg 440.0000000000001

    return {
      name: control.name,
      sources,
      connected: _.some(sources, 'connected'),
      unipolar,
      natural
    };
  });
}

/**
 * calcPointsEntering - given pointsUnderBrush and the previousPointsUnderBrush,
 * return a list of those points that are currently just entering the brush area.
 *
 * Normal function; not a selector.
 */
export const calcPointsEntering = (pointsUnderBrush, previousPointsUnderBrush) =>
  _.difference(pointsUnderBrush || [], previousPointsUnderBrush || []);

export function makeXYMapper(mappingControls, param) {
  if (param) {
    const control = _.find(mappingControls, { name: param });
    if (control) {
      return makeMapper(control.natural.spec);
    }
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

  return xyPointsEnteringToSynthEvents(
    pointsEntering,
    interaction.m,
    interaction.n,
    getSound(state),
    getMapping(state),
    getXYMappingControls(state),
    npoints
  );
}

/**
 * Given the current mapping assignments and the mappingControls,
 * return a function that maps x and y to synth args.
 *
 * Mapping may specify to map x (or y) to multiple synth params,
 * it isn't just mapped to a single value.
 *
 * @param  {Object}     mapping
 * @param  {Object}     mappingControls
 * @return {Function}   (x, y) -> {param: value, ... paramN: valueN}
 */
function makeXYMappingFn(mapping, mappingControls) {
  const paramsX = _.get(mapping, 'xy.x.params', {});
  const paramsY = _.get(mapping, 'xy.y.params', {});

  // {paramName: mappingFunction, ...}
  // If there is no available mapper (because mode is switching etc)
  // then map to null and then in the mapping function omit those nulls
  const alwaysNull = _.constant(null);
  const mappersX = _.mapValues(
    paramsX,
    (v, paramX) => makeXYMapper(mappingControls, paramX) || alwaysNull
  );
  const mappersY = _.mapValues(
    paramsY,
    (v, paramY) => makeXYMapper(mappingControls, paramY) || alwaysNull
  );
  // mapping function
  return (x, y) => {
    return _.assign(
      {},
      // {paramName: mappingFunction, ...} -> {paramName: mappedValue, ...}
      _.omitBy(_.mapValues(mappersX, mapper => mapper(x)), _.isNull),
      _.omitBy(_.mapValues(mappersY, mapper => mapper(y)), _.isNull)
    );
  };
}

export function xyPointsEnteringToSynthEvents(
  pointsEntering,
  m,
  n,
  sound,
  mapping,
  mappingControls,
  npoints
) {
  if (pointsEntering.length === 0) {
    return [];
  }

  if (!sound) {
    return [];
  }

  const mapXY = makeXYMappingFn(mapping, mappingControls);

  const fixedArgs = {};
  mappingControls.forEach(mc => {
    if (!mc.connected) {
      fixedArgs[mc.name] = mc.natural.value;
    }
  });

  return pointsEntering.map(index => {
    const x = npoints[m].values[index];
    const y = 1.0 - npoints[n].values[index];
    const args = mapXY(x, 1.0 - y);

    return {
      defName: sound.name,
      args: _.assign(args, fixedArgs)
    };
  });
}

/**
 * makeMapper - return one of the mapping functions from supercollider.js
 *
 * @param  {Object} spec Similar to supercollider's ControlSpec
 * @return {Function}    Function that maps a unipolar value to the Spec's range and warp curve.
 */
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

/**
 * getLoopModePayload - Builds the payload for 'setLoop' action that is sent to the main thread
 * to be sent by the SoundApp and then sent using the updateStream to the
 * SynthEventList dryad.
 *
 * This is a Reselect selector.
 *
 * @return {Object} events, loopTime, epoch
 */
export const getLoopModePayload = createSelector(
  [getSound, getLoop, getNormalizedPoints, getMapping, getXYMappingControls],
  (sound, loopMode, npoints, mapping, mappingControls) => {
    if (!sound || !loopMode.box) {
      return {
        events: []
      };
    }

    const events = loopModeEvents(
      loopMode.box.m,
      loopMode.box.n,
      _.isUndefined(loopMode.timeDimension) ? null : loopMode.timeDimension,
      npoints,
      mapping,
      mappingControls,
      sound,
      loopMode.loopTime
    );

    return {
      events,
      loopTime: loopMode.loopTime,
      epoch: loopMode.epoch
    };
  }
);

/**
 * Generate synth events for each point in the loop
 *
 * @param  {int} m                  Feature to map to x
 * @param  {int} n                  Feature to map to y
 * @param  {int} t                  Feature to map to use for time axis.
 *                                    null: means to use index, spacing events
 *                                      evenly over the loop time.
 *                                    'x': use the same feature as the x
 * @param  {Array<Object>} npoints  Normalized points
 * @param  {Object} mapping         Mapping specification
 * @param  {Object} mappingControls Spec for mapping of two inputs (x y) to sound params
 * @param  {Object} sound           Sound with defName = .name
 * @param  {float} loopTime         Loop time in seconds.
 * @return {Array<Object>}          Array of synth events
 */
export function loopModeEvents(m, n, t, npoints, mapping, mappingControls, sound, loopTime) {
  // If size is wrong eg. after loading a new dataset and loopMode is set from
  // previous one
  if (!(npoints[m] && npoints[n])) {
    // just return an empty list
    return [];
  }

  const mapXY = makeXYMappingFn(mapping, mappingControls);

  const timeSpec = {
    warp: 'lin',
    minval: 0.0,
    maxval: loopTime
  };

  let mapTime;
  if (_.isNull(t)) {
    // Evenly step through the points in index order
    const timeStep = loopTime / npoints[m].values.length;
    mapTime = i => timeStep * i;
  } else {
    // Use dimension t as the time value
    // letter 'x' means use feature for x dim
    const autoT = t === 'x' ? m : t;
    const timeMapper = makeMapper(timeSpec);
    mapTime = i => timeMapper(npoints[autoT].values[i]);
  }

  const fixedArgs = {};
  mappingControls.forEach(mc => {
    if (!mc.connected) {
      fixedArgs[mc.name] = mc.natural.value;
    }
  });

  return npoints[m].values.map((x, i) => {
    const y = npoints[n].values[i];
    const args = mapXY(x, y);

    return {
      time: mapTime(i),
      defName: sound.name,
      args: _.assign(args, fixedArgs)
    };
  });
}
