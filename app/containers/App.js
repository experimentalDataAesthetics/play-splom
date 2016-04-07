const React = require('react');
const h = require('react-hyperscript');
import styles from './App.css';

export default class App extends React.Component {

  render() {
    return h('div',
      { className: styles.app },
      [
        this.props.children
      ]);
  }
}
