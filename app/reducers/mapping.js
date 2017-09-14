import u from 'updeep';
import _ from 'lodash';
import { sourcesFromStats } from '../selectors/dataset';
import { NUM_SELECTABLE_SOURCE_SLOTS } from '../constants';

// interface Action {
//   type: string;
//   payload: any;
// }
//
// interface XY {
//   params: {
//     [paramName: string]: boolean;
//   };
// }
//
// interface XYMode {
//   selectableSlots?: {
//     [slotName: string]: string; // datasource name
//   };
//   x: XY;
//   y: XY;
//   [selectableSlot: string]: XY;
// }
//
// interface MappingState {
//   mode: string;
//   xy: XYMode;
// }

// const initial: MappingState = {
//   mode: "xy",
//   xy: {
//     x: { params: {} },
//     y: { params: {} }
//   }
// };
//
// export default initial;

export default {};

/**
 * Map any control source like 'x' 'y' or any named dataset stat
 * to the named sound parameter.
 *
 * This sound parameter will stay mapped even if you change to a different
 * sound that doesn't have that param (eg. 'dispersion').
 * If you switch back to the previous sound or to a new sound that does have
 * a param of that name, then it will come up as connected.
 *
 * @param {Object} state
 * @param {Object} action
 * @param {string} action.payload.xy control source name
 * @param {string} action.payload.param sound param name
 */
export function mapXYtoParam(state, action) {
  // const payload = action.payload; // {mode: "xy", xy: controlName, param: paramName}
  const control = action.payload.xy;
  const param = action.payload.param;
  const isConnected = _.get(state, `xy.${control}.params.${param}`);
  // toggle it
  const connecting = !isConnected;
  const selectableSlots = state.xy && state.xy.selectableSlots;

  const editXY = {
    [control]: {
      params: {
        [param]: connecting
      }
    }
  };

  // Only one control may connect to a param
  // set all controls to false for this param
  if (connecting && selectableSlots) {
    _.concat(['x', 'y'], _.values(selectableSlots)).forEach(ctrl => {
      if (ctrl !== control) {
        editXY[ctrl] = {
          params: {
            [param]: false
          }
        };
      }
    });
  }

  const edit = {
    mode: 'xy',
    xy: editXY
  };

  return u(edit, state);
}

/**
 * Given state and the sound that is about to be selected,
 * mutate state so that mapping.xy[x,y].params[left,right] = controlName
 *
 * @param  {Object} state - state.mapping
 * @param  {Object} action - payload.sound i the sound to be selected and mapped to
 * @return {Object}       new state
 */
export function autoMap(state, action) {
  const sound = action.payload.sound;
  if (sound) {
    // could map
    const controlNames = sound.controlNames;
    if (state.xy) {
      const currentlyMapped = _.concat(_.keys(state.xy.x.params), _.keys(state.xy.y.params));

      // state.xy
      //  .x.params keys
      //  .y.params keys
      let currentIndices = _.map(currentlyMapped, name => _.indexOf(controlNames, name));
      currentIndices = _.filter(currentIndices, v => v > 0);

      //  if < 2 then try the first two
      if (currentIndices.length < 2) {
        const nextState = mapXYtoParam(state, { payload: { xy: 'x', param: controlNames[1] } });
        return mapXYtoParam(nextState, { payload: { xy: 'y', param: controlNames[2] } });
      }
    } else {
      // just select the first two as long as there are that many
      const nextState = mapXYtoParam(state, { payload: { xy: 'x', param: controlNames[1] } });
      return mapXYtoParam(nextState, { payload: { xy: 'y', param: controlNames[2] } });
    }
  }

  return state;
}

export function setFixedParam(state, action) {
  // sets unipolar values to unipolarMappingRanges
  // selector calculates natural mapped values for display
  // and sending synths
  return u(
    {
      unipolarMappingRanges: {
        [action.payload.param]: action.payload.values
      }
    },
    state
  );
}

export function setSelectableSlot(state, action) {
  return u(
    {
      xy: {
        selectableSlots: {
          [action.payload.slot]: action.payload.datasource
        }
      }
    },
    state
  );
}

/**
 * Set initial default values for each of the selectable slots -
 * the ones that map derived statistics to sound parameter targets.
 *
 * This only really needs to happen on app startup.
 *
 * @param {object} state
 */
export function autoSetSelectableSlots(state, action) {
  // Already set
  if (state.xy.selectableSlots) {
    return state;
  }

  const dataset = action.payload.dataset;

  // All those possible
  const selectableSources = sourcesFromStats(dataset.stats);

  const selectableSlots = {};
  for (let index = 0; index < NUM_SELECTABLE_SOURCE_SLOTS; index += 1) {
    selectableSlots[String(index)] = selectableSources[index];
  }

  return u(
    {
      xy: {
        selectableSlots
      }
    },
    state
  );
}

export function setMapping(state, action) {
  return u(
    {
      [action.payload.feature]: {
        param: action.payload.param
      }
    },
    state
  );
}

export function setMappingRange(state, action) {
  return u(
    {
      [action.payload.feature]: {
        range: action.payload.range
      }
    },
    state
  );
}
