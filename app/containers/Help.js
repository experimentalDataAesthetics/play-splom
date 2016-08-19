import React from 'react';
import h from 'react-hyperscript';

/**
 * As UI focus or hover changes,
 * the help text is set and shown here in the bottom right panel.
 *
 * Not yet doing anything.
 *
 * The help text would come from redux state or would
 * be loaded from markdown based on the current ui-context/state.
 */
export default class Help extends React.Component {
  render() {
    return h('div.help', [
      // h('h6', 'Help'),
      h('div', '')
    ]);
  }
}
