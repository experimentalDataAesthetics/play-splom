import {MAP_XY_TO_PARAM, SET_MAPPING, SET_MAPPING_RANGE, SET_PCA} from '../actionTypes';

/**
 * Connect X/Y to a sound param for xy mode
 */
export function mapXYtoParam(xy, param) {
  return {
    type: MAP_XY_TO_PARAM,
    payload: {
      mode: 'xy',
      xy: xy,
      param: param
    }
  };
}

/**
 * Connect dataset feature to sound param for multi-variate mode
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
 * Set the target range for a sound parameter to range (Object)
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
 * Set PCA for current dataset.
 *
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
