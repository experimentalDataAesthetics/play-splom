/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import _ from 'lodash';
import * as selectors from '../../app/selectors/sound';

describe('selectors/sound', () => {
  const sound = {
    hasArrayArgs: false,
    inputs: [],
    hasGate: false,
    name: 'blip',
    hasVariants: false,
    output: [
      {
        rate: 'audio',
        startingChannel: 'out',
        numberOfChannels: 2,
        type: 'Out'
      }
    ],
    controls: [
      {
        name: 'out',
        defaultValue: 0,
        lag: 0,
        rate: 'control',
        index: 0
      },
      {
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
      },
      {
        name: 'numharm',
        defaultValue: 200,
        lag: 0,
        rate: 'control',
        index: 2,
        // note defaultValue > maxval
        // should correct for this bad input
        spec: {
          minval: 1,
          maxval: 128,
          warp: 'lin'
        }
      },
      {
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
      },
      {
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
      },
      {
        name: 'smooth',
        defaultValue: 0.0099999997764826,
        lag: 0,
        rate: 'control',
        index: 5
      },
      {
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
      }
    ],
    canFreeSynth: true,
    controlNames: ['out', 'freq', 'numharm', 'pan', 'timeScale', 'smooth', 'amp']
  };

  const npoints = [
    {
      name: 'a',
      index: 0,
      values: [0, 0.25, 0.5, 1.0]
    },
    {
      name: 'b',
      index: 1,
      values: [0, 0.25, 0.5, 1.0]
    },
    {
      name: 'c',
      index: 2,
      values: [0, 0.25, 0.5, 1.0]
    }
  ];

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
    const synths = selectors.xyPointsEnteringToSynthEvents(
      [1, 3],
      0,
      1,
      sound,
      mapping,
      mappingControls,
      npoints
    );
    it('should return 2 synth events', () => {
      expect(synths.length).to.equal(2);
    });
    it('should have synth args of length 5', function() {
      // 3 modulated and 2 fixed
      const args = synths[0].args;
      expect(Object.keys(args).length).to.equal(5);
    });
  });

  describe('xyMappingControls', function() {
    it('should make given no prior mapping', function() {
      const xym = selectors.xyMappingControls(mapping, sound);
      expect(xym.length).to.equal(5); // 5 modulateable controls
      const timeScale = xym[3];
      expect(timeScale.natural.value).to.equal(1);
    });

    it('should have no NaN in controls', function() {
      const xym = selectors.xyMappingControls(mapping, sound);
      const pan = xym[2];
      expect(_.isNaN(pan.unipolar.value)).to.be.false;
    });

    it('should set .natural', function() {
      const xym = selectors.xyMappingControls(mapping, sound);
      const pan = xym[2];
      expect(typeof pan.natural).to.equal('object');
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
      const pan = xym[2];

      expect(pan.unipolar.minval).to.equal(0.25);
      expect(pan.unipolar.value).to.equal(0.5);

      expect(pan.natural.minval).to.equal(-0.5);
      expect(pan.natural.value).to.equal(0);
    });

    describe('defaults if no unipolarMappingRanges supplied', function() {
      const m2 = _.assign({}, mapping);
      const xym = selectors.xyMappingControls(m2, sound);
      const pan = xym[2];

      it('minval', function() {
        expect(pan.unipolar.minval).to.equal(0);
      });

      it('maxval', function() {
        expect(pan.unipolar.maxval).to.equal(1);
      });

      it('should get value from spec and unmap it', function() {
        expect(pan.unipolar.value).to.equal(0.5);
      });
    });

    it('should clip a defaultValue to maxval of spec', function() {
      const m2 = _.assign({}, mapping);
      const xym = selectors.xyMappingControls(m2, sound);
      const numharms = xym[1];

      expect(numharms.unipolar.value).to.equal(1);
      expect(numharms.natural.value).to.equal(128);
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
    const loopMode = {
      m: 0,
      n: 1,
      looping: true,
      loopTime: 10.0
    };

    // loopModeEvents(m, n, npoints, mapping, mappingControls, sound, loopTime)
    it('should return an array of objects', function() {
      const events = selectors.loopModeEvents(
        0,
        1,
        npoints,
        mapping,
        mappingControls,
        sound,
        loopMode.loopTime
      );

      // expect(events).to.be.a('array');
      expect(events.length).to.equal(npoints[0].values.length);
      const first = events[0];
      expect(first.defName).to.be.a('string');
      expect(first.args).to.be.a('object');
      expect(first.time).to.be.a('number');
    });

    it('should return a list of events for SynthEventList updateStream', function() {
      const sel = selectors.loopModeEvents(
        loopMode.m,
        loopMode.n,
        npoints,
        mapping,
        mappingControls,
        sound,
        loopMode.loopTime
      );

      expect(sel.length).to.equal(npoints[0].values.length);
      const first = sel[0];
      expect(first.defName).to.be.a('string');
      // 2 fixed, 3 modulated
      expect(Object.keys(first.args).length).to.equal(5);
    });

    // loopModePayload does that
    // it('should return null if no sound', function() {
    //   const sel = selectors.loopModeEvents(loopMode.m, loopMode.nn,
    //     npoints, mapping, mappingControls, null, loopMode.loopTime);
    //
    //   expect(sel.length).to.equal(0);
    // });

    // it('should return null if not looping', function() {
    //   const sel = selectors.loopModeSynthEventList(
    //     {looping: false}, sound, npoints, mapping, mappingControls);
    //   expect(sel.length).to.equal(0);
    // });
  });

  describe('makeXYMapper', function() {
    const fn = selectors.makeXYMapper(mappingControls, 'pan');
    it('should be a function', function() {
      expect(fn).to.be.a('function');
    });
  });
});

const pairwise = {
  Date: {
    cor: {
      Date: null,
      Month: null,
      Year: 0.9009311952825864,
      Army: 0.8818957622757273,
      Disease: -0.22811693680548575,
      Wounds: 0.06166299881572622,
      Other: -0.13163780045759335,
      'Disease.rate': -0.25867046096413593,
      'Wounds.rate': -0.031553107137757955,
      'Other.rate': -0.1838433695656411
    },
    corRank: {
      Date: -0.11304347826086958,
      Month: 0.26521739130434785,
      Year: -0.2760869565217392,
      Army: -0.3182608695652174,
      Disease: 0.24956521739130433,
      Wounds: -0.3519565217391305,
      Other: -0.3234782608695652,
      'Disease.rate': 0.3052173913043478,
      'Wounds.rate': -0.10586956521739133,
      'Other.rate': 0.006086956521739184
    }
  }
};

describe('pairwiseMinMax', () => {
  it('should find min max from the dataset.stats', () => {
    const minmax = selectors.pairwiseMinMax(pairwise);

    expect(minmax).to.deep.equal({
      cor: { min: -0.25867046096413593, max: 0.9009311952825864 },
      corRank: { min: -0.3519565217391305, max: 0.3052173913043478 }
    });
    // expect(minmax.cor.min).to.equal(-0.25867046096413593);
    // expect(minmax.cor.max).to.equal(0.9009311952825864);
    // expect(minmax.corRank.min).to.equal(-0.3519565217391305);
    // expect(minmax.corRank.max).to.equal(0.3052173913043478);
  });
});

describe('_statsTable', () => {
  const stats = { pairwise };
  const fields = ['Date'];

  it('should make pairwise lookup table', () => {
    const table = selectors._statsTable(stats, fields);
    expect(table).to.deep.equal({
      cor: {
        '0@0': 0.5
      },
      corRank: {
        '0@0': 0.3635461462123719
      }
    });
  });
});
