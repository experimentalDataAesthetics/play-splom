/* eslint no-unused-expressions: 0 */
import {
  expect
} from 'chai';
// import { spy, stub } from 'sinon';
import * as selectors from '../../app/selectors/dataset';
import * as _ from 'lodash';

describe('dataset', () => {
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
});
