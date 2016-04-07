/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
// import { spy } from 'sinon';
import * as selectors from '../../app/selectors/index';

describe('selectors', () => {
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
        index: 2
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
      const synths = selectors.xyPointsEnteringToSynthEvents([1, 3], 0, 1, sound, null, npoints);
      expect(synths.length).to.equal(2);
    });
  });
});
