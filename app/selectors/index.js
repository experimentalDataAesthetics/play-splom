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
      let data = dataset.data.column(name).data;
      let extent = d3.extent(data);
      return {
        name: name,
        index: i,
        values: data,
        min: extent[0],
        max: extent[1],
        mean: d3.mean(data),
        std: d3.deviation(data)
      };
    });
  }
);

/**
 * Transform points to normalized unipolar points
 */
export const getNormalizedPoints = createSelector(
  [getFeatures],
  (features) => {
    return (features || []).map((feature) => {
      // subtract mean
      // divide by range
      // or:
      //  divide by std
      //  clip
      let range = feature.max - feature.min;
      if (range === 0) {
        range = 1;
      }

      let normalize = (v) => {
        return (v - feature.mean) / range + 0.5;
      };

      return {
        name: feature.name,
        index: feature.index,
        values: feature.values.map(normalize)
      };
    });
  }
);

// export const getPointsEntering = createSelector(
//   [getPointsUnderBrush, getPreviousPointsUnderBrush],
//   (pointsUnderBrush, previousPointsUnderBrush) => {
//     console.log(pointsUnderBrush, previousPointsUnderBrush);
//     return _.difference(pointsUnderBrush || [], previousPointsUnderBrush || []);
//   }
// );

/**
 * Normal function; not a selector.
 */
export const calcPointsEntering = (pointsUnderBrush, previousPointsUnderBrush) => {
  return _.difference(pointsUnderBrush || [], previousPointsUnderBrush || []);
};

function makeXYMapper(mapping, sound, param, xy) {
  if (param) {
    // a custom mapper is set (not yet implemented, always blank)
    let mapperOptions = _.get(mapping, `xy.${xy}.mapper`);
    if (!mapperOptions) {
      let control = _.find(sound.controls, {name: param});
      if (!control.spec) {
        // no spec so just return the defaultValue always
        if (control.defaultValue) {
          return function() {
            return control.defaultValue;
          };
        } else {
          // no way to map this one
          // just guess with 0 though this can break things
          return function() {
            return 0;
          };
        }
      }

      mapperOptions = control.spec;
    }

    return makeMapper(mapperOptions);
  }
}

/**
 * A normal function; not a selector
 * Needs the full state
 */
export function spawnEventsFromBrush(state) {
  let pointsUnderBrush = getPointsUnderBrush(state) || [];
  let previousPointsUnderBrush = getPreviousPointsUnderBrush(state) || [];
  let pointsEntering = calcPointsEntering(pointsUnderBrush, previousPointsUnderBrush);
  let sound = getSound(state);
  let mapping = getMapping(state);
  let interaction = getInteraction(state);
  let npoints = getNormalizedPoints(state);

  return xyPointsEnteringToSynthEvents(pointsEntering, interaction.m, interaction.n, sound, mapping, npoints);
}

export function xyPointsEnteringToSynthEvents(pointsEntering, m, n, sound, mapping, npoints) {
  if (pointsEntering.length === 0) {
    return [];
  }

  if (!sound) {
    return [];
  }

  // these only change when mapping changes
  let paramX = _.get(mapping, 'xy.x.param');
  let paramY = _.get(mapping, 'xy.y.param');
  let mapperX = makeXYMapper(mapping, sound, paramX, 'x');
  let mapperY = makeXYMapper(mapping, sound, paramY, 'y');

  return pointsEntering.map((index) => {
    let x = npoints[m].values[index];
    let y = npoints[n].values[index];
    let args = {};
    if (paramX) {
      args[paramX] = mapperX(x);
    }

    if (paramY) {
      args[paramY] = mapperY(y);
    }

    return {
      defName: sound.name,
      args: args
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
