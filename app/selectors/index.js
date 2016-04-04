const createSelector = require('reselect').createSelector;
const d3 = require('d3');
const _ = require('lodash');

const getDataset = (state) => state.dataset;
const getPointsUnderBrush = (state) => state.interation.pointsUnderBrush && state.pointsUnderBrush.indices;
const getPointsEntering = (state) => state.interaction.pointsEntering;
const getPreviousPointsUnderBrush = (state) => state.interaction.previousPointsUnderBrush && state.previousPointsUnderBrush.indices;
const getSoundName = (state) => state.sound;
const getSounds = (state) => state.sounds;

export const getSound = createSelector(
  [getSoundName, getSounds],
  (soundName, sounds) => {
    console.log(sounds);
    for (let sound of sounds) {
      console.log(sound);
      if (sound.name === soundName) {
        return sound;
      }
    }

    return null;
  }
);

/**
 * Extract each column as values
 * with min, max, mean, std calculated
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

// points to normalized unipolar points
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

export const calcPointsEntering = (pointsUnderBrush, previousPointsUnderBrush) => {
  return _.difference(pointsUnderBrush || [], previousPointsUnderBrush || []);
}
//
// export const getPointsExiting = createSelector(
//   [getPointsUnderBrush, getPreviousPointsUnderBrush],
//   (pointsUnderBrush, previousPointsUnderBrush) => _.difference(previousPointsUnderBrush || [], pointsUnderBrush || [])
// );

// mappers for each feature to the args
// changes when pointsUnderBrush are in different m/n
//
// this gets updated into .synth.spawnEvents
// and forwarded to background thread
// somewhere somebody has to ask for this
// usually its the component
// for sound it will be a subscribe
export const spawnEventsFromPointsEntering = createSelector(
  [getPointsEntering, getNormalizedPoints, getSound],
  (pointsEntering, normalizedPoints, sound) => {
    // never gets called again
    // because SoundSelector never demands it
    // because its props nor state never changes
    if (!sound) {
      return [];
    }

    console.log('pointsEntering', pointsEntering);
    return (pointsEntering || []).map((index) => {
      // which features are mapped to sound
      // let v1 = normalizedPoints[feat1].values[index];
      // build args
      return {
        defName: sound.name,
        args: {
          // something something something
        }
      };
    });
  }
);

/**
 * A normal function; not a selector
 * Needs the full state
 */
export const spawnEventsFromBrush = (state) => {
  let pointsEntering = calcPointsEntering(state.pointsUnderBrush, state.previousPointsUnderBrush);

  if (pointsEntering.length === 0) {
    return [];
  }
  console.log('pointsEntering', pointsEntering);

  let sound = getSound(state);
  if (!sound) {
    console.log('no sound selected');
    return [];
  }

  // which features are mapped to sound
  // let v1 = normalizedPoints[feat1].values[index];
  // build args
  return (pointsEntering || []).map((index) => {
    return {
      defName: sound.name,
      args: {
        // something something something
      }
    };
  });
};

// export function brushPointsAction(indices, m, n) {
//
// }
