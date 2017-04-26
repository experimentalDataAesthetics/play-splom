/**
 * Connect X/Y to a sound param for xy mode
 */
export function mapXYtoParam(xy, param) {
  return {
    type: 'mapXYtoParam',
    payload: {
      mode: 'xy',
      xy,
      param
    }
  };
}

/**
 * Automatically map x and y if they are not yet assigned
 */
export function autoMap() {
  return {
    type: 'autoMap',
    payload: {}
  };
}

/**
 * Set a non-mapped sound param to a fixed value.
 *
 * Supplies the 0..1 unipolar value and maps it using the sound spec.
 */
export function setFixedParamUnipolar(param, value) {
  return {
    type: 'setFixedParam',
    payload: {
      param,
      values: {
        value
      }
    }
  };
}

/**
 * Sets the range for a mapped sound param,
 * specified with 0..1 values
 */
export function setParamRangeUnipolar(param, minval, maxval) {
  return {
    type: 'setFixedParam',
    payload: {
      param,
      values: {
        minval,
        maxval
      }
    }
  };
}

/**
 * Connect dataset feature to sound param for multi-variate mode.
 *
 * not yet used
 */
export function setMapping(feature, param) {
  return {
    type: 'setMapping',
    payload: {
      feature,
      param
    }
  };
}

/**
 * Set the target range for a sound parameter to range (Object)
 *
 * not yet used
 */
export function setMapperRange(feature, param, range) {
  return {
    type: 'setMappingRange',
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
 *
 * not yet used
 */
export function setPCA(bool) {
  return {
    type: 'setPca',
    payload: {
      bool
    }
  };
}
