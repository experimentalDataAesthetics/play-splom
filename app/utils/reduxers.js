
import { createSelector } from 'reselect';
import { connect as reduxConnect } from 'react-redux';
import _ from 'lodash';

/**
 * Create a reselect selector from an object of selector definitions.
 *
 *   {
 *      // use a string to just extract state.keyToExtractFromState
 *      name: 'keyToExtractFromState',  // same as: (state) => state.keyToExtractFromState
 *      // use a function to manually extract from state
 *      other: (state) => state.other.map((o) => o.name)
 *   }
 *
 * After using connect your component will have this.props.name and this.props.other
 * which will be the subset of state that they need for rendering.
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
    if (!_.isFunction(getter)) {
      throw new Error(`${k} is not a selector Function: ${getter}`);
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
 * Given an object of action creators, return a dispatch function.
 *
 *  {
 *    openDialog: openDatasetDialog,
 *    // can also pass a function that then calls the action creator
 *    onSelect: (e, path) => loadDataset(path)
 *  }
 *
 * After using connect your component will have this.props.openDialog and this.props.onSelect
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

/**
 * An enhanced version of redux.connect
 *
 * Takes simple objects and connects your component to redux selectors and dispatch functions.
 *
 * See selectState and mapActions above.
 */
export default function connect(selectors, handlers) {
  return reduxConnect(selectState(selectors), mapActions(handlers));
}
