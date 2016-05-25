
import { createSelector } from 'reselect';
import * as _ from 'lodash';

export function selectState(obj) {
  const names = _.keys(obj);
  const getters = names.map((k) => obj[k]);
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
