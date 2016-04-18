import { map } from 'supercolliderjs';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { getNormalizedPoints } from './dataset';

const getPointsUnderBrush =
  (state) => _.get(state, 'interaction.pointsUnderBrush', []);
const getPreviousPointsUnderBrush =
  (state) => _.get(state, 'interaction.previousPointsUnderBrush', []);
const getInteraction = (state) => state.interaction || {};
const getSoundName = (state) => state.sound;
const getSounds = (state) => state.sounds;
const getMapping = (state) => state.mapping || {};

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

  const modulateable = (c) => (c.name !== 'out') && (c.rate === 'control' && (c.spec));

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
      const unipolar = _.defaults({},
        _.get(mapping, `.unipolarMappingRanges.${control.name}`, {}),
        {
          value: findDefault(control),
          minval: 0.0,
          maxval: 1.0
        });
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
    const y = npoints[n].values[index];
    const args = {};
    if (mapperX) {
      args[paramX] = mapperX(x);
    }

    if (mapperY) {
      args[paramY] = mapperY(y);
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
 * Builds the payload for SET_LOOP action
 */
export function loopModePayload(state) {
  const loopMode = state.interaction.loopMode;
  const sound = getSound(state);
  const npoints = getNormalizedPoints(state);
  const mapping = getMapping(state);
  const mappingControls = getXYMappingControls(state);
  return {
    events: loopModeSynthEventList(loopMode, sound, npoints, mapping, mappingControls),
    epoch: _.now() + 300
  };
}

export function loopModeSynthEventList(loopMode, sound, npoints, mapping, mappingControls) {
  const loopTime = loopMode.loopTime || 10.0;
  if (loopMode.looping && sound) {
    // create list from m n npoints mapping
    return loopModeEvents(loopMode.m, loopMode.n,
      npoints, mapping, mappingControls, sound, loopTime);
  } else {
    return [];
  }
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
  // get fixed values, pick those in current sound
  // what happend ?
  // mappingControls that are in sound
  const fixedArgs = {};
  mappingControls.forEach((mc) => {
    if (!mc.connected) {
      fixedArgs[mc.name] = mc.natural.value;
    }
  });

  return npoints[m].values.map((x, i) => {
    const y = npoints[n].values[i];
    const args = {};
    if (paramX) {
      args[paramX] = mapperX(x);
    }

    if (paramY) {
      args[paramY] = mapperY(y);
    }

    return {
      time: timeMapper(x),
      defName: sound.name,
      args: _.assign(args, fixedArgs)
    };
  });
}

/**
 * Returns a dryadic json document
 *
 * ['syntheventlist', {
   defaultParams: {
     defName: 'blip',
     args: {}
   },
   events: [
     {
       time:
       args: {}
     }
   ]
  }]
 */
// export function loopModeSynthEventList(loopMode, sound, npoints, mapping) {
//   const loopTime = loopMode.loopTime || 10.0;
//   if (loopMode.looping && sound) {
//     // create list from m n npoints mapping
//     return [
//       'syntheventlist',
//       {
//         defaultParams: {
//           defName: sound.name,
//           args: {}  // fixed args
//         },
//         events: loopModeEvents(loopMode.m, loopMode.n, npoints, mapping, sound, loopTime)
//       }
//     ];
//   } else {
//     return null;  // delete current playing loop, replace with nothing
//   }
// }