
import { createSelector } from 'reselect';
import { connect as reduxConnect } from 'react-redux';
import * as _ from 'lodash';

/**
 * Create a reselect selector
 */
export function selectState(selectors) {
  if (!selectors) {
    return null;
  }

  const names = _.keys(selectors);
  // if its a string then select from state
  const getters = names.map((k) => {
    const getter = selectors[k];
    if (_.isString(getter)) {
      return (state) => state[getter];
    }

    return getter;
  });

  return createSelector(
    getters,
    (...results) => {
      const result = {};
      _.each(names, (k, i) => {
        result[k] = results[i];
      });
      return result;
    });
}

/**
 * Map handlers
 */
export function mapActions(handlers) {
  if (!handlers) {
    return null;
  }

  return (dispatch) => {
    return _.mapValues(handlers, (fn) => {
      return (...args) => {
        dispatch(fn(...args));
      };
    });
  };
}

export default function connect(selectors, handlers) {
  return reduxConnect(selectState(selectors), mapActions(handlers));
}
