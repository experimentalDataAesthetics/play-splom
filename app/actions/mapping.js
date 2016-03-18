import {SET_MAPPING, SET_MAPPING_RANGE, SET_PCA} from '../actionTypes';

/**
 * connect dataset feature to sound param
 */
export function setMapping(feature, param) {
  return {
    type: SET_MAPPING,
    payload: {
      feature,
      param
    }
  };
}

/**
 * set the target range for a sound parameter
 * to range (Object)
 */
export function setMapperRange(feature, param, range) {
  return {
    type: SET_MAPPING_RANGE,
    payload: {
      feature,
      param,
      range
    }
  };
}

/**
 * set PCA for current dataset
 * This could result in async calculation
 * and produces a new mapping metadata
 */
export function setPCA(bool) {
  return {
    type: SET_PCA,
    payload: {
      bool
    }
  };
}
