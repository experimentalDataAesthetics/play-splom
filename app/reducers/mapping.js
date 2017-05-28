import u from 'updeep';
import _ from 'lodash';

export default {};

export function mapXYtoParam(state, action) {
  const payload = action.payload;
  // toggle: if already mapped to this then disconnect it
  if (_.get(state, `xy.${payload.xy}.params.${payload.param}`)) {
    return u(
      {
        mode: 'xy',
        xy: {
          [payload.xy]: {
            // updeep: filter this param out of params
            params: u.omit(payload.param)
          }
        }
      },
      state
    );
  }

  // connect it
  return u(
    {
      mode: 'xy',
      xy: {
        [payload.xy]: {
          params: {
            [payload.param]: true
          }
        },
        // disconnect the obverse if it is connected
        // you cannot map both x and y to the same param
        [payload.xy === 'x' ? 'y' : 'x']: {
          params: u.omit(payload.param)
        }
      }
    },
    state
  );
}

/**
 * Given state and the sound that is about to be selected,
 * mutate state so that mapping.xy[x,y].params[left,right] = controlName
 *
 * @param  {Object} state - state.mapping
 * @param  {[type]} sound - the sound to be selected and mapped to
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
