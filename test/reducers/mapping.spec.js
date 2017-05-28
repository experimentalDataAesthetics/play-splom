/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */
import { expect } from 'chai';
import * as mappingModule from '../../app/reducers/mapping';
import { autoReducer } from '../../app/utils/reduxers';

const mapping = autoReducer(mappingModule);

describe('mapping', function() {
  describe('setFixedParam', function() {
    const setRange = {
      type: 'setFixedParam',
      payload: {
        param: 'freq',
        values: {
          minval: 0.25,
          maxval: 0.75
        }
      }
    };
    const setValue = {
      type: 'setFixedParam',
      payload: {
        param: 'freq',
        values: {
          value: 0.5
        }
      }
    };

    it('should setRange', function() {
      const state = mapping({}, setRange);
      expect(state.unipolarMappingRanges.freq).to.deep.equal(setRange.payload.values);
    });

    it('should still have range set after doing setRange ... setValue', function() {
      const state = mapping({}, setRange);
      const state2 = mapping(state, setValue);
      const should = { minval: 0.25, maxval: 0.75, value: 0.5 };
      expect(state2.unipolarMappingRanges.freq).to.eql(should);
    });
  });

  describe('autoMap', function() {
    const sound = require('./_sound-fixture.json');
    const should = {
      mode: 'xy',
      xy: {
        x: {
          params: {
            freqL: true
          }
        },
        y: {
          params: {
            freqR: true
          }
        }
      }
    };

    const payload = {
      type: 'autoMap',
      payload: {
        sound
      }
    };

    // given state, sound
    // map x and y to first two params
    it('should map given a blank state', function() {
      const state = mapping({}, payload);
      expect(state).to.eql(should);
    });

    it('should map given a second state', function() {
      const state = mapping({}, payload);
      const state2 = mapping(state, payload);
      expect(state2).to.eql(should);
    });
  });
});
