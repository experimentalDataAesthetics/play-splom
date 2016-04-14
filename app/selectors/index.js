import { centeredSquare } from '../utils/layout';
import { autoScale } from '../utils/mapping';
import { map } from 'supercolliderjs';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import d3 from 'd3';

const getDataset = (state) => state.dataset;
const getPointsUnderBrush =
  (state) => _.get(state, 'interaction.pointsUnderBrush', []);
const getPreviousPointsUnderBrush =
  (state) => _.get(state, 'interaction.previousPointsUnderBrush', []);
const getInteraction = (state) => state.interaction || {};
const getSoundName = (state) => state.sound;
const getSounds = (state) => state.sounds;
const getMapping = (state) => state.mapping || {};
export const getWindowSize = (state) => {
  if (state.ui.windowSize) {
    return state.ui.windowSize;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

export const getNumFeatures = createSelector(
  [getDataset],
  (dataset) => {
    if (!dataset) {
      return 0;
    }

    return dataset.data.columnNames().length;
  }
);

/**
 * Layout sizes and style depending on windowSize
 * and the dataset numFeatures
 * Will also include theme when that is added.
 */
export const getLayout = createSelector(
  [getWindowSize, getNumFeatures],
  (windowSize, numFeatures) => {
    const layout = {};
    const big = windowSize.width > 600;
    const sidebarWidth = big ? 300 : 0;
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
    }

    layout.svgStyle = centeredSquare(layout.svgWidth, windowSize.height);

    layout.sideLength = layout.svgWidth / (numFeatures || 1);

    return layout;
  }
);

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
    let dv = _.find([control.defaultValue, control.spec.defaultValue], _.isNumber);
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

/**
 * Builds the payload for SET_LOOP action
 */
export function loopModePayload(state) {
  const loopMode = state.interaction.loopMode;
  const sound = getSound(state);
  const npoints = getNormalizedPoints(state);
  const mapping = getMapping(state);
  return {
    events: loopModeSynthEventList(loopMode, sound, npoints, mapping),
    epoch: _.now() + 300
  };
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

export function loopModeSynthEventList(loopMode, sound, npoints, mapping) {
  const loopTime = loopMode.loopTime || 10.0;
  if (loopMode.looping && sound) {
    // create list from m n npoints mapping
    return loopModeEvents(loopMode.m, loopMode.n, npoints, mapping, sound, loopTime);
  } else {
    return [];
  }
}

export function loopModeEvents(m, n, npoints, mapping, sound, loopTime) {
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
  const mapperX = makeXYMapper(mapping, sound, paramX, 'x');
  const mapperY = makeXYMapper(mapping, sound, paramY, 'y');

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
      args
    };
  });
}
