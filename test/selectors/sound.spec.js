/* eslint no-unused-expressions: 0 */
import {
  expect
} from 'chai';
// import { spy, stub } from 'sinon';
import * as selectors from '../../app/selectors/sound';
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
        param: 'timeScale',
        mapper: {
          rate: 'control',
          minval: 0.25,
          maxval: 0.75
        }
      }
    }
  };

  const mappingControls = selectors.xyMappingControls(mapping, sound);

  describe('xyPointsEnteringToSynthEvents', () => {
    const synths = selectors.xyPointsEnteringToSynthEvents([1, 3],
      0,
      1,
      sound,
      mapping,
      mappingControls,
      npoints);
    it('should return 2 synth events', () => {
      expect(synths.length).to.equal(2);
    });
    it('should have synth args of length 4', function() {
      // 2 modulated and 2 fixed
      const args = synths[0].args;
      expect(Object.keys(args).length).to.equal(4);
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
      const events = selectors.loopModeEvents(0, 1,
        npoints, mapping, mappingControls, sound, loopTime);

      // expect(events).to.be.a('array');
      expect(events.length).to.equal(npoints[0].values.length);
      const first = events[0];
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
      const sel = selectors.loopModeSynthEventList(
        loopMode, sound, npoints, mapping, mappingControls);
      expect(sel.length).to.equal(npoints[0].values.length);
      const first = sel[0];
      expect(first.defName).to.be.a('string');
      // should be 4 now: 2 fixed, 2 modulated
      expect(Object.keys(first.args).length).to.equal(4);
    });

    it('should return null if no sound', function() {
      const sel = selectors.loopModeSynthEventList(
        loopMode, null, npoints, mapping, mappingControls);
      expect(sel.length).to.equal(0);
    });

    it('should return null if not looping', function() {
      const sel = selectors.loopModeSynthEventList(
        {looping: false}, sound, npoints, mapping, mappingControls);
      expect(sel.length).to.equal(0);
    });
  });

  describe('makeXYMapper', function() {
    const fn = selectors.makeXYMapper(mappingControls, 'pan');
    it('should be a function', function() {
      expect(fn).to.be.a('function');
    });

  });

});
