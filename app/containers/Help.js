import React from 'react';
import h from 'react-hyperscript';

/**
 * As UI focus or hover changes,
 * the help text is set and shown here in the bottom right panel.
 */
export default class Help extends React.Component {
  render() {
    return h('div.help', [
      h('h6', 'Help'),
      h('div', '')
    ]);
  }
}
