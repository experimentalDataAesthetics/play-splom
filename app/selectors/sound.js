import { map } from 'supercolliderjs';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { getNormalizedPoints } from './dataset';

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
 * getXYMappingControls - Generates an object for each modulateable control of the current sound.
 *
 * used by XYParamTable
 *
 * Each object contains:
 *
 *   name
 *   xConnected
 *   yConnected
 *   connected
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

  const isConnected = (xy, param) => {
    if (!mapping) {
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
    const xcon = isConnected('x', control.name);
    const ycon = isConnected('y', control.name);
    const connected = xcon || ycon;
    const spec = control.spec;
    // const minval = _.get(mapping, '')

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
      xConnected: xcon,
      yConnected: ycon,
      connected,
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
 * @param  {Object} mapping         [description]
 * @param  {Object} mappingControls [description]
 * @return {Object}                 [description]
 */
function makeXYMappingFn(mapping, mappingControls) {
  const paramsX = _.get(mapping, 'xy.x.params', {});
  const paramsY = _.get(mapping, 'xy.y.params', {});

  // {paramName: mappingFunction, ...}
  // If there is no available mapper (because mode is switching etc)
  // then map to null and then in the mapping function omit those nulls
  const alwaysNull = () => null;
  const mappersX = _.mapValues(
    paramsX,
    (v, paramX) => makeXYMapper(mappingControls, paramX) || alwaysNull
  );
  const mappersY = _.mapValues(
    paramsY,
    (v, paramY) => makeXYMapper(mappingControls, paramY) || alwaysNull
  );
  // mapping funciton
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
 * getLoopModePayload - Builds the payload for SET_LOOP action that is sent to the main thread
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
 * @param  {[type]} m               [description]
 * @param  {[type]} n               [description]
 * @param  {[type]} npoints         [description]
 * @param  {[type]} mapping         [description]
 * @param  {[type]} mappingControls [description]
 * @param  {[type]} sound           [description]
 * @param  {[type]} loopTime        [description]
 * @return {[type]}                 [description]
 */
export function loopModeEvents(m, n, npoints, mapping, mappingControls, sound, loopTime) {
  // Now you have both time and x mapped to the same parameters.
  // It will accentuate it I guess
  const mapXY = makeXYMappingFn(mapping, mappingControls);

  const timeSpec = {
    warp: 'lin',
    minval: 0.0,
    maxval: loopTime
  };
  const timeMapper = makeMapper(timeSpec);

  const fixedArgs = {};
  mappingControls.forEach(mc => {
    if (!mc.connected) {
      fixedArgs[mc.name] = mc.natural.value;
    }
  });

  // if size is wrong eg. after loading a new dataset and loopMode is set from previous one
  if (!(npoints[m] && npoints[n])) {
    // just return an empty list
    return [];
  }

  return npoints[m].values.map((x, i) => {
    const y = npoints[n].values[i];
    const args = mapXY(x, y);

    return {
      time: timeMapper(x),
      defName: sound.name,
      args: _.assign(args, fixedArgs)
    };
  });
}
