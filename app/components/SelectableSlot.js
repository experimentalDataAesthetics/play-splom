import React from 'react';
import TextSelect from 'react-textselect';

/**
 * Display and select which datasource a selectable slot
 * is getting it's data from.
 *
 * These are used to map fixed dataset statistics to sound parameters.
 *
 * css is included in app.global.css
 *
 * sources[slot] datasource
 *
 * action is setSelectableSlot
 *
 * options is selectableSources
 *
 */
export default function SelectableSlot({ slot, sources, action, datasource }) {
  const index = sources.indexOf(datasource);
  return (
    <TextSelect
      options={sources}
      active={index > -1 ? index : slot}
      onChange={(e, i) => action(slot, sources[i])}
    />
  );
}
