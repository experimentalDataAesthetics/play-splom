const React = require('react');
var h = require('react-hyperscript');

import {DatasetSelector} from './DatasetSelector';
import {SoundSelector} from './SoundSelector';
import {ParamMapping} from './ParamMapping';
import {Help} from './Help';

export class Sidebar extends React.Component {
  render() {
    return h('aside#sidebar', [
      h(DatasetSelector),
      h(SoundSelector),
      h(ParamMapping),
      h(Help)
    ]);
  }
}
