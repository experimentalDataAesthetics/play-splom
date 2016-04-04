
const combineReducers = require('redux').combineReducers;

import dataset from './dataset';
import datasets from './datasets';
import mapping from './mapping';
import sound from './sound';
import sounds from './sounds';
import ui from './ui';
import interaction from './interaction';
import transport from './transport';

export default combineReducers({
  datasets,
  dataset,
  sounds,
  sound,
  mapping,
  ui,
  interaction,
  transport
});
