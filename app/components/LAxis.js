import h from 'react-hyperscript';


/**
 * Draw a very minimal L-shaped axis along the bottom left of a plot.
 *
 * Each plot has one of these.
 */
export default (props) => {
  return h('polyline', {
    points: `0,0 0,${props.sideLength} ${props.sideLength},${props.sideLength}`,
    strokeWidth: 1,
    stroke: props.color,
    fill: 'none'
  });
};
