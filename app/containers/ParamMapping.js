const React = require('react');
var h = require('react-hyperscript');

export default class ParamMapping extends React.Component {
  render() {
    return h('div.param-mapping', [
      h('h6', 'Sound Params')
    ]);
  }
}
