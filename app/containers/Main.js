const React = require('react');
var h = require('react-hyperscript');

import {Sidebar} from './Sidebar';
import {ScatterPlots} from './ScatterPlots';

export class Main extends React.Component {
  render() {
    return h('section.main', [
      h(ScatterPlots),
      h(Sidebar)
    ]);
  }
}
