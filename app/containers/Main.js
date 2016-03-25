const React = require('react');
var h = require('react-hyperscript');

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import CenteredSquareFrame from  '../components/CenteredSquareFrame';

export default class Main extends React.Component {
  render() {
    return h('section.main', [
      h(CenteredSquareFrame, [
        h(SVGFrame)
      ]),
      h(Sidebar)
    ]);
  }
}
