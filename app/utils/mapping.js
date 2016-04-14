import d3 from 'd3';
import * as _ from 'lodash';

/**
 * Detect type and extent of values
 * and create a function that scales values to range.
 *
 * This uses d3's scale functions which do not have the musical functions
 * of supercollider.
 */
export function autoScale(values, range) {

  // empty set
  if (values.length === 0) {
    return d3.scale.linear().domain([0, 1]).range(range);
  }

  const first = values[0];

  // time series
  if (_.isDate(first)) {
    return d3.time.scale()
      .domain(d3.extent(values)).nice()
      .range([range[0], range[1] * 0.95]);
  }

  // ordinals, class and category strings
  if (_.isString(first)) {
    const domain = Array.from((new Set(values)));
    // if domain is length 1 then its not useful for mapping
    return d3.scale.ordinal()
      .domain(domain)
      .rangeRoundPoints(range);
  }

  // normal linear
  return d3.scale.linear()
    .domain(d3.extent(values)).nice()
    .range(range);
}
