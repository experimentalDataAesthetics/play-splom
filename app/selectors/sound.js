import { map } from 'supercolliderjs';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { getNormalizedPoints } from './dataset';

export const getPointsUnderBrush =
  (state) => _.get(state, 'interaction.pointsUnderBrush', []);
const getPreviousPointsUnderBrush =
  (state) => _.get(state, 'interaction.previousPointsUnderBrush', []);
const getInteraction = (state) => state.interaction || {};
const getSoundName = (state) => state.sound;
const getSounds = (state) => state.sounds;
const getMapping = (state) => state.mapping || {};
const getLoop = (state) => _.get(state, 'interaction.loopMode', {});

export const getSound = createSelector(
  [getSoundName, getSounds],
  (soundName, sounds) => {
    for (const sound of sounds) {
      if (sound.name === soundName) {
        return sound;
      }
    }

    return null;
  }
);

/**
 * used by XYParamTable
 * Generates an object for each modulateable control of the current sound.
 *
 * name
 * xConnected
 * yConnected
 * connected
 * unipolar
 *   value
 *   minval
 *   maxval
 * natural
 *   value
 *   minval
 *   maxval
 */
export const getXYMappingControls = createSelector(
  [getMapping, getSound],
  xyMappingControls);

export function xyMappingControls(mapping, sound) {
  if (!sound) {
    return [];
  }

  const modulateable = (c) => (c.name !== 'out') && c.spec;

  const isConnected = (xy, param) => {
    if (!mapping) {
      return false;
    }

    return _.get(mapping, `xy.${xy}.param`) === param;
  };

  const findDefault = (control) => {
    const dv = _.find([control.defaultValue, control.spec.defaultValue], _.isNumber);
    if (_.isUndefined(dv)) {
      return 0.5;
    }

    return map.unmapWithSpec(dv, control.spec);
  };

  return sound.controls.filter(modulateable)
    .map((control) => {
      const xcon = isConnected('x', control.name);
      const ycon = isConnected('y', control.name);
      const connected = xcon || ycon;
      const spec = control.spec;
      // const minval = _.get(mapping, '')

      // value should be unmapped defaultValue
      const unipolar = _.assign({
        value: _.clamp(findDefault(control), 0, 1),
        minval: 0.0,
        maxval: 1.0
      }, _.get(mapping, `unipolarMappingRanges.${control.name}`));

      // natural is mapping those three
      const natural = _.mapValues(unipolar, (v) => map.mapWithSpec(v, spec));
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
 * Normal function; not a selector.
 */
export const calcPointsEntering = (pointsUnderBrush, previousPointsUnderBrush) =>
  _.difference(pointsUnderBrush || [], previousPointsUnderBrush || []);

export function makeXYMapper(mappingControls, param) {
  if (param) {
    const control = _.find(mappingControls, {name: param});
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

  return xyPointsEnteringToSynthEvents(pointsEntering,
    interaction.m,
    interaction.n,
    getSound(state),
    getMapping(state),
    getXYMappingControls(state),
    npoints);
}

export function xyPointsEnteringToSynthEvents(pointsEntering,
  m,
  n,
  sound,
  mapping,
  mappingControls,
  npoints) {
  if (pointsEntering.length === 0) {
    return [];
  }

  if (!sound) {
    return [];
  }

  // these only change when mapping changes
  const paramX = _.get(mapping, 'xy.x.param');
  const paramY = _.get(mapping, 'xy.y.param');
  const mapperX = makeXYMapper(mappingControls, paramX);
  const mapperY = makeXYMapper(mappingControls, paramY);
  const fixedArgs = {};
  mappingControls.forEach((mc) => {
    if (!mc.connected) {
      fixedArgs[mc.name] = mc.natural.value;
    }
  });

  return pointsEntering.map((index) => {
    const x = npoints[m].values[index];
    const y = 1.0 - npoints[n].values[index];
    const args = {};
    if (mapperX) {
      args[paramX] = mapperX(x);
    }

    if (mapperY) {
      args[paramY] = mapperY(1.0 - y);
    }

    return {
      defName: sound.name,
      args: _.assign(args, fixedArgs)
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

/**
 * loopModePayload - Builds the payload for SET_LOOP action that is sent to the main thread
 * to be sent by the SoundApp and then sent using the updateStream to the
 * SynthEventList dryad.
 */
export function loopModePayload(state) {
  const sound = getSound(state);
  const loopMode = getLoop(state);
  if (!sound || (!loopMode.box)) {
    return {
      events: []
    };
  }

  const npoints = getNormalizedPoints(state);
  const mapping = getMapping(state);
  const mappingControls = getXYMappingControls(state);

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


export function loopModeEvents(m, n, npoints, mapping, mappingControls, sound, loopTime) {
  // now you have time and x doing the same movement
  // it will accentuate it I guess
  const paramX = _.get(mapping, 'xy.x.param');
  const paramY = _.get(mapping, 'xy.y.param');

  const timeSpec = {
    warp: 'lin',
    minval: 0.0,
    maxval: loopTime
  };
  const timeMapper = makeMapper(timeSpec);
  const mapperX = makeXYMapper(mappingControls, paramX);
  const mapperY = makeXYMapper(mappingControls, paramY);
  const fixedArgs = {};
  mappingControls.forEach((mc) => {
    if (!mc.connected) {
      fixedArgs[mc.name] = mc.natural.value;
    }
  });

  return npoints[m].values.map((x, i) => {
    const y = npoints[n].values[i];
    const args = {};
    if (mapperX) {
      args[paramX] = mapperX(x);
    }

    if (mapperY) {
      args[paramY] = mapperY(y);
    }

    return {
      time: timeMapper(x),
      defName: sound.name,
      args: _.assign(args, fixedArgs)
    };
  });
}
