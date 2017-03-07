import {
  expect
} from 'chai';
import * as interaction from '../../app/actions/interaction';

describe('actions/interaction', function() {

  describe('setPointsUnderBrush', function() {
    let did = false;
    const dispatch = () => did = true;
    const s = {
      interaction: {
        m: 1,
        n: 1,
        pointsUnderBrush: []
      }
    };
    let getState = () => s;

    it('should not dispatch if same as last time', function() {
      interaction.setPointsUnderBrush(1, 1, [])(dispatch, getState);
      expect(did).to.be.false;
    });
  });

});
