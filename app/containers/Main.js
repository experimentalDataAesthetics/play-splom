import { Component } from 'react';
import h from 'react-hyperscript';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import CenteredSquareFrame from '../components/CenteredSquareFrame';
import styles from './Main.css';

export default class Main extends Component {
  render() {
    return h('section',
      { className: styles.main },
      [
        h(CenteredSquareFrame, [
          h(SVGFrame)
        ]),
        h(Sidebar)
      ]);
  }
}
