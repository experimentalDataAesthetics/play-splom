import u from 'updeep';
import * as _ from 'lodash';

import {
  MAP_XY_TO_PARAM,
  AUTO_MAP,
  SET_FIXED_PARAM,
  SET_MAPPING,
  SET_MAPPING_RANGE,
} from '../actionTypes';

export default function(state = {}, action) {
  switch (action.type) {

    case MAP_XY_TO_PARAM:
      return mapXYToParam(state, action.payload);

    case AUTO_MAP:
      return autoMap(state, action.payload.sound);

    case SET_FIXED_PARAM:
      // sets unipolar values to unipolarMappingRanges
      // selector calculates natural mapped values for display
      // and sending synths
      return u({
        unipolarMappingRanges: {
          [action.payload.param]: action.payload.values
        }
      }, state);

    case SET_MAPPING:
      return u({
        [action.payload.feature]: {
          param: action.payload.param
        }
      }, state);

    case SET_MAPPING_RANGE:
      return u({
        [action.payload.feature]: {
          range: action.payload.range
        }
      }, state);

    default:
      return state;
  }
}


function mapXYToParam(state, payload) {
  // toggle: if already mapped to this then disconnect it
  if (_.get(state, `xy.${payload.xy}.params.${payload.param}`)) {
    return u({
      mode: 'xy',
      xy: {
        [payload.xy]: {
          // updeep: filter this param out of params
          params: u.omit(payload.param)
        }
      }
    }, state);
  }

  // connect it
  return u({
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
  }, state);
}


/**
 * Given state and the sound that is about to be selected,
 * mutate state so that mapping.xy[x,y].params[left,right] = controlName
 *
 * @param  {Object} state - state.mapping
 * @param  {[type]} sound - the sound to be selected and mapped to
 * @return {Object}       new state
 */
function autoMap(state, sound) {
  if (sound) {
    // could map
    const controlNames = sound.controlNames;
    if (state.xy) {
      const currentlyMapped = _.concat(
        _.keys(state.xy.x.params),
        _.keys(state.xy.y.params));

      // state.xy
      //  .x.params keys
      //  .y.params keys
      let currentIndices = _.map(currentlyMapped, name => _.indexOf(controlNames, name));
      currentIndices = _.filter(currentIndices, v => v > 0);

      //  if < 2 then try the first two
      if (currentIndices.length < 2) {
        const nextState = mapXYToParam(state, {xy: 'x', param: controlNames[1]});
        return mapXYToParam(nextState, {xy: 'y', param: controlNames[2]});
      }
    } else {
      // just select the first two as long as their are that many
      const nextState = mapXYToParam(state, {xy: 'x', param: controlNames[1]});
      return mapXYToParam(nextState, {xy: 'y', param: controlNames[2]});
    }
  }

  return state;
}
