const React = require('react');
var h = require('react-hyperscript');

import Sidebar from './Sidebar';
import ScatterPlots from './ScatterPlots';
import CenteredSquareFrame from  '../components/CenteredSquareFrame';

export default class Main extends React.Component {
  render() {
    return h('section.main', [
      h(CenteredSquareFrame, [
        h(ScatterPlots)
      ]),
      h(Sidebar)
    ]);
  }
}
