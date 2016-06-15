import h from 'react-hyperscript';

export default (props) => {
  // draw a minimal L-shaped axis
  return h('polyline', {
    points: `0,0 0,${props.sideLength} ${props.sideLength},${props.sideLength}`,
    strokeWidth: 1,
    stroke: props.color,
    fill: 'none'
  });
};
