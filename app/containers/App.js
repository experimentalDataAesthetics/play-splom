const React = require('react');
const h = require('react-hyperscript');

export default class App extends React.Component {

  render() {
    return h('div#app', [
      this.props.children
    ]);
  }
}
