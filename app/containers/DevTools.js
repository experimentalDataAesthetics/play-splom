import React from 'react';
import { createDevTools } from 'redux-devtools';
// import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterableLogMonitor from 'redux-devtools-filterable-log-monitor';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={false}
  >
    <FilterableLogMonitor />
  </DockMonitor>
);
