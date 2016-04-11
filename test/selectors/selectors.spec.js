/* eslint no-unused-expressions: 0 */
import {
  expect
} from 'chai';
// import { spy } from 'sinon';
import * as selectors from '../../app/selectors/index';
import * as _ from 'lodash';

describe('selectors', () => {
  const sound = {
    hasArrayArgs: false,
    inputs: [],
    hasGate: false,
    name: 'blip',
    hasVariants: false,
    output: [{
      rate: 'audio',
      startingChannel: 'out',
      numberOfChannels: 2,
      type: 'Out'
    }],
    controls: [{
      name: 'out',
      defaultValue: 0,
      lag: 0,
      rate: 'control',
      index: 0
    }, {
      name: 'freq',
      defaultValue: 440,
      lag: 0,
      rate: 'control',
      spec: {
        default: 440,
        maxval: 20000,
        class: 'ControlSpec',
        minval: 20,
        warp: 'exp',
        step: 0,
        units: ' Hz'
      },
      index: 1
    }, {
      name: 'numharm',
      defaultValue: 200,
      lag: 0,
      rate: 'control',
      index: 2
    }, {
      name: 'pan',
      defaultValue: 0,
      lag: 0,
      rate: 'control',
      spec: {
        default: 0,
        maxval: 1,
        class: 'ControlSpec',
        minval: -1,
        warp: 'linear',
        step: 0,
        units: ''
      },
      index: 3
    }, {
      name: 'timeScale',
      defaultValue: 1,
      lag: 0,
      rate: 'control',
      spec: {
        default: 1,
        maxval: 10,
        class: 'ControlSpec',
        minval: 0.1,
        warp: 'linear',
        step: 0,
        units: ''
      },
      index: 4
    }, {
      name: 'smooth',
      defaultValue: 0.0099999997764826,
      lag: 0,
      rate: 'control',
      index: 5
    }, {
      name: 'amp',
      defaultValue: 1,
      lag: 0,
      rate: 'control',
      spec: {
        default: 0,
        maxval: 1,
        class: 'ControlSpec',
        minval: 0,
        warp: 'amp',
        step: 0,
        units: ''
      },
      index: 6
    }],
    canFreeSynth: true,
    controlNames: [
      'out',
      'freq',
      'numharm',
      'pan',
      'timeScale',
      'smooth',
      'amp'
    ]
  };

  describe('xyPointsEnteringToSynthEvents', () => {
    it('should return synth events', () => {
      const npoints = [{
        name: 'a',
        index: 0,
        values: [0, 0.25, 0.5, 1.0]
      }, {
        name: 'b',
        index: 1,
        values: [0, 0.25, 0.5, 1.0]
      }, {
        name: 'c',
        index: 2,
        values: [0, 0.25, 0.5, 1.0]
      }];
      const mapping = {
        xy: {
          x: {
            param: 'pan',
            mapper: {
              rate: 'control',
              minval: 0.25,
              maxval: 0.75
            }
          },
          y: {
            param: 'wobble',
            mapper: {
              rate: 'control',
              minval: 0.25,
              maxval: 0.75
            }
          }
        }
      };
      const synths = selectors.xyPointsEnteringToSynthEvents([1, 3],
        0,
        1,
        sound,
        mapping,
        npoints);
      expect(synths.length).to.equal(2);
      const args = synths[0].args;
      expect(Object.keys(args).length).to.equal(2);
    });
  });

  describe('normalizePoints', () => {
    it('should gloss over nulls in values', function() {
      const feature = {
        name: 'year',
        index: 0,
        values: [2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
          1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987, 1986, 1985,
          1984, 1983, 1982, 1981, 1980, null],
        min: 1980,
        max: 2013,
        typ: 'number',
        mean: 1996.5,
        std: 9.958246164193104
      };

      const npoints = selectors.normalizePoints(feature);
      const all = _.every(npoints.values, (v) => v >= 0.0 && v <= 1.0);
      expect(all).to.equal(true);
    });
  });
});
