import u from 'updeep';
import _ from 'lodash';

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
  const payload = action.payload;
  const isConnected = _.get(state, `xy.${payload.xy}.params.${payload.param}`);

  const editXY = {
    [payload.xy]: {
      // toggle it
      params: isConnected
        ? u.omit(payload.param)
        : {
          [payload.param]: true
        }
    }
  };

  // x or y: disconnect the obverse
  // you cannot map both x and y to the same param
  if (payload.xy === 'x' || payload.xy === 'y') {
    editXY[payload.xy === 'x' ? 'y' : 'x'] = {
      params: u.omit(payload.param)
    };
  }

  return u(
    {
      mode: 'xy',
      xy: editXY
    },
    state
  );
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
      // just select the first two as long as their are that many
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
