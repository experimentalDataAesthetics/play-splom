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

    it('should scale values around mean to 0..1', function() {
      const feature = {
        name: 'JohnsonJohnson',
        index: 2,
        values: [
          0.71,
          0.63,
          0.85,
          0.44,
          0.61,
          0.69,
          0.92,
          0.55,
          0.72,
          0.77,
          0.92,
          0.6,
          0.83,
          0.8,
          1,
          0.77,
          0.92,
          1,
          1.24,
          1,
          1.16,
          1.3,
          1.45,
          1.25,
          1.26,
          1.38,
          1.86,
          1.56,
          1.53,
          1.59,
          1.83,
          1.86,
          1.53,
          2.07,
          2.34,
          2.25,
          2.16,
          2.43,
          2.7,
          2.25,
          2.79,
          3.42,
          3.69,
          3.6,
          3.6,
          4.32,
          4.32,
          4.05,
          4.86,
          5.04,
          5.04,
          4.41,
          5.58,
          5.85,
          6.57,
          5.31,
          6.03,
          6.39,
          6.93,
          5.85,
          6.93,
          7.74,
          7.83,
          6.12,
          7.74,
          8.91,
          8.28,
          6.84,
          9.54,
          10.26,
          9.54,
          8.73,
          11.88,
          12.06,
          12.15,
          8.91,
          14.04,
          12.96,
          14.85,
          9.99,
          16.2,
          14.67,
          16.02,
          11.61
        ],
        min: 0.44,
        max: 16.2,
        typ: 'number',
        mean: 4.799761904761905,
        std: 4.309991187811548
      };

      const npoints2 = selectors.normalizePoints(feature);
      const all = _.every(npoints2.values, (v) => v >= 0.0 && v <= 1.0);
      expect(all).to.equal(true);
    });

  });
});
