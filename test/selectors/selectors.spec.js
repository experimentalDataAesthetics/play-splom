/* eslint no-unused-expressions: 0 */
import {
  expect
} from 'chai';
// import { spy, stub } from 'sinon';
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

  describe('xyPointsEnteringToSynthEvents', () => {
    it('should return synth events', () => {
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

  describe('xyMappingControls', function() {
    it('should make given no prior mapping', function() {
      const xym = selectors.xyMappingControls(mapping, sound);
      expect(xym.length).to.equal(4);  // 4 modulateable controls
      const timeScale = xym[3];
      expect(timeScale.natural.value).to.equal(1);
    });

    it('should have no NaN in controls', function() {
      const xym = selectors.xyMappingControls(mapping, sound);
      const pan = xym[1];
      expect(_.isNaN(pan.unipolar.value)).to.be.false;
    });

    it('should set .natural', function() {
      const xym = selectors.xyMappingControls(mapping, sound);
      const pan = xym[1];
      expect(pan.natural).to.be.a('object');
    });

    // if unipolarMappingRanges is set then use those
    it('should use unipolarMappingRanges if set', function() {
      const m2 = _.assign({}, mapping);
      m2.unipolarMappingRanges = {
        pan: {
          minval: 0.25,
          maxval: 0.75,
          value: 0.5
        }
      };

      const xym = selectors.xyMappingControls(m2, sound);
      const pan = xym[1];

      expect(pan.unipolar.minval).to.equal(0.25);
      expect(pan.natural.minval).to.equal(-0.5);
      expect(pan.unipolar.value).to.equal(0.5);
      expect(pan.natural.value).to.equal(0);
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

      const npoints2 = selectors.normalizePoints(feature);
      const all = _.every(npoints2.values, (v) => v >= 0.0 && v <= 1.0);
      expect(all).to.equal(true);
    });
  });

  // describe('loopModePayload', function() {
  //   let state = {
  //     sounds: [sound],
  //     sound: sound.name,
  //     interaction: {
  //       loopMode: {
  //         looping: true,
  //         m: 0,
  //         n: 1,
  //         loopTime: 10.0
  //       }
  //     }
  //   };
  //   let st = stub(selectors, 'getNormalizedPoints').returns(npoints);
  //   selectors.getNormalizedPoints = st;
  //
  //   console.log('giviein', npoints);
  //
  //   let payload = selectors.loopModePayload(state);
  //   expect(payload).to.be.a('object');
  // });

  describe('loopModeEvents', function() {
    it('should return an array of objects', function() {
      const loopTime = 10.0;
      const events = selectors.loopModeEvents(0, 1, npoints, mapping, sound, loopTime);

      // expect(events).to.be.a('array');
      expect(events.length).to.equal(npoints[0].values.length);
      let first = events[0];
      expect(first.defName).to.be.a('string');
      expect(first.args).to.be.a('object');
      expect(first.time).to.be.a('number');
    });
  });

  describe('loopModeSynthEventList', function() {
    const loopMode = {
      m: 0,
      n: 1,
      looping: true,
      loopTime: 10.0
    };

    it('should return a list of events for SynthEventList updateStream', function() {
      const sel = selectors.loopModeSynthEventList(loopMode, sound, npoints, mapping);
      expect(sel.length).to.equal(npoints[0].values.length);
      let first = sel[0];
      expect(first.defName).to.be.a('string');
      expect(Object.keys(first.args).length).to.equal(2);
    });

    it('should return null if no sound', function() {
      const sel = selectors.loopModeSynthEventList(loopMode, null, npoints, mapping);
      expect(sel.length).to.equal(0);
    });

    it('should return null if not looping', function() {
      const sel = selectors.loopModeSynthEventList({looping: false}, sound, npoints, mapping);
      expect(sel.length).to.equal(0);
    });
  });
});
