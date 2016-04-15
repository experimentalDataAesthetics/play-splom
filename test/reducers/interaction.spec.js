
import {
  expect
} from 'chai';
import interaction from '../../app/reducers/interaction';
import {
  TOGGLE_LOOP_MODE,
  SET_POINTS_UNDER_BRUSH,
  SET_LOOPING
} from '../../app/actionTypes';

describe('interaction', function() {

  describe('TOGGLE_LOOP_MODE', function() {
    const click1 = {
      type: TOGGLE_LOOP_MODE,
      payload: {
        m: 1,
        n: 1
      }
    };
    const click2 = {
      type: TOGGLE_LOOP_MODE,
      payload: {
        m: 2,
        n: 2
      }
    };

    it('should toggle loop from null state', function() {
      const state = interaction({}, click1);
      expect(state.loopMode.looping).to.equal(true);
    });

    it('should keep loop mode when clicking other', function() {
      const initial = interaction({}, click1);
      const state = interaction(initial, click2);
      expect(state.loopMode.looping).to.equal(true);
    });

    it('should toogle loop back off when clicking same', function() {
      const initial = interaction({}, click1);
      const state = interaction(initial, click1);
      expect(state.loopMode.looping).to.equal(false);
    });
  });

  describe('setLooping', function() {
    const pending = {
      type: SET_LOOPING,
      payload: {
        pending: {
          m: 1,
          n: 1
        }
      }
    };

    const blank = {
      type: SET_LOOPING,
      payload: {}
    };

    const playing = {
      type: SET_LOOPING,
      payload: {
        nowPlaying: {
          m: 1,
          n: 1
        },
        pending: {}
      }
    };

    it('should set pending', function() {
      let s = interaction({}, pending);
      expect(s.loopMode.pending.m).to.equal(1);
      expect(s.loopMode.pending.n).to.equal(1);
    });

    it('should set playing', function() {
      let s = interaction({}, pending);
      let r = interaction(s, playing);
      expect(r.loopMode.nowPlaying.m).to.equal(1);
      expect(r.loopMode.nowPlaying.n).to.equal(1);
      expect(r.loopMode.pending.m).to.be.undefined;
      expect(r.loopMode.pending.n).to.be.undefined;
    });

    it('should unset on blank', function() {
      let s = interaction({}, playing);
      let r = interaction(s, blank);
      expect(r.loopMode.pending.m).to.be.undefined;
      expect(r.loopMode.pending.n).to.be.undefined;
      expect(r.loopMode.nowPlaying.m).to.be.undefined;
      expect(r.loopMode.nowPlaying.n).to.be.undefined;
    });
  });

  describe('SET_POINTS_UNDER_BRUSH', function() {
    const click1 = {
      type: SET_POINTS_UNDER_BRUSH,
      payload: {
        indices: [1, 3],
        m: 1,
        n: 1
      }
    };
    const newPoints = {
      type: SET_POINTS_UNDER_BRUSH,
      payload: {
        indices: [4, 6],
        m: 1,
        n: 1
      }
    };
    const differentBox = {
      type: SET_POINTS_UNDER_BRUSH,
      payload: {
        indices: [1, 3],
        m: 2,
        n: 2
      }
    };
    const nothing = {
      type: SET_POINTS_UNDER_BRUSH,
      payload: {
        indices: [],
        m: 2,
        n: 2
      }
    };

    it('should set points on initial', function() {
      const state = interaction({}, click1);
      expect(state.pointsUnderBrush).to.equal(click1.payload.indices);
    });

    it('should set new points', function() {
      const state = interaction({}, click1);
      const state2 = interaction(state, newPoints);
      expect(state2.pointsUnderBrush).to.equal(newPoints.payload.indices);
    });

    it('should not set new points if same', function() {
      const state = interaction({}, click1);
      const state2 = interaction(state, click1);
      expect(state).to.equal(state2);
    });

    it('should set new points if different quadrant', function() {
      const state = interaction({}, click1);
      const state2 = interaction(state, differentBox);
      expect(state).not.to.equal(state2);
    });

    it('should unset points if none', function() {
      const state = interaction({}, click1);
      const state2 = interaction(state, nothing);
      expect(state2.pointsUnderBrush).to.equal(nothing.payload.indices);
    });
  });
});
