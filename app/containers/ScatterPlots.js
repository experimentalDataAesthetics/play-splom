const React = require('react');
var h = require('react-hyperscript');

export class ScatterPlots extends React.Component {
  render() {
    return h('article#scatterplots', [
      h('h1.dataset-title', 'title of dataset'),
      h('div.scatterplots-frame', 'scatterplots d3')
    ]);
  }
}
