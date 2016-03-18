const React = require('react');
const h = require('react-hyperscript');

// import { Header } from 'components/Header';
// import { Footer } from 'components/Footer';

export class App extends React.Component {

  // static propTypes = {
  //   children: React.PropTypes.any
  // };

  render() {
    return h('section', [
      this.props.children
    ]);
  }
}
