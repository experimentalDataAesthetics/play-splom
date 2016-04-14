
import {
  expect
} from 'chai';
import mapping from '../../app/reducers/mapping';
import * as types from '../../app/actionTypes';

describe('mapping', function() {

  describe('SET_FIXED_PARAM', function() {
    const setRange = {
      type: types.SET_FIXED_PARAM,
      payload: {
        param: 'freq',
        values: {
          minval: 0.25,
          maxval: 0.75
        }
      }
    };
    const setValue = {
      type: types.SET_FIXED_PARAM,
      payload: {
        param: 'freq',
        values: {
          value: 0.5
        }
      }
    };

    it('should setRange', function() {
      const state = mapping({}, setRange);
      expect(state.unipolarMappingRanges.freq)
        .to.deep.equal(setRange.payload.values);
    });

    it('should still have range set after doing setRange ... setValue', function() {
      const state = mapping({}, setRange);
      const state2 = mapping(state, setValue);
      expect(state2.unipolarMappingRanges.freq)
        .to.deep.equal({
          minval: 0.25,
          maxval: 0.75,
          value: 0.5
        });
    });
  });

});
