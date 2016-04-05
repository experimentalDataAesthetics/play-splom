const d3 = require('d3');
const _ = require('lodash');

export function autoScale(values, range) {

  // empty set
  if (values.length === 0) {
    return d3.scale.linear().domain([0, 1]).range(range);
  }

  let first = values[0];

  // time series
  if (_.isDate(first)) {
    let extent = d3.extent(values);
    return d3.time.scale().domain(extent).nice().range([range[0], range[1] * 0.95]);
  }

  // ordinals, class and category strings
  if (_.isString(first)) {
    let domain = Array.from((new Set(values)));
    // if domain is length 1 then its not useful for mapping
    return d3.scale.ordinal().domain(domain).rangeRoundPoints(range);
  }

  // normal linear
  return d3.scale.linear().domain(d3.extent(values)).nice().range(range);
}
