import React from 'react';
import FeatureLabel from './FeatureLabel';

export default function FeatureLabels({ dataset, layout, width, height, color = '#fff' }) {
  if (!dataset) {
    return null;
  }

  const children = [];

  const sideLength = layout.sideLength;
  // const margin = layout.margin;
  const columnNames = dataset.columnNames;

  layout.boxes.forEach(box => {
    // only for the L and B rows
    if (box.m === 0) {
      children.push(
        <FeatureLabel
          key={`${box.m}${box.n}l`}
          label={columnNames[box.n]}
          orient="left"
          textColor={color}
          x={box.x}
          y={box.y}
          offset={40}
          width={sideLength}
          height={sideLength}
        />
      );
    }

    if (box.n === 0) {
      children.push(
        <FeatureLabel
          key={`${box.m}${box.n}b`}
          label={columnNames[box.m]}
          orient="bottom"
          textColor={color}
          x={box.x}
          y={box.y}
          offset={20}
          width={sideLength}
          height={sideLength}
        />
      );
    }
  });

  return <g width={width} height={height}>{children}</g>;
}
