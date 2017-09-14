import { List, ListItem, MakeSelectable } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import React from 'react';

const SelectableList = MakeSelectable(List);

function SimpleSelect({ options, value, action }) {
  // const onChange = (e, i, v) => set(v);
  return (
    <SelectField value={value} onChange={action}>
      {options.map(vl => <MenuItem value={vl.value} primaryText={vl.label} key={vl.label} />)}
    </SelectField>
  );
}

function ListSelect({ options, value, action }) {
  return (
    <SelectableList value={value} onChange={action} className="selectable-list">
      {options.map(option => (
        <ListItem
          key={option.value}
          primaryText={option.label}
          selected={option.value === value}
          style={{
            fontSize: '1em'
          }}
          innerDivStyle={{
            padding: '8px'
          }}
          value={option.value}
        />
      ))}
    </SelectableList>
  );
}

export default class Select extends React.PureComponent {
  render() {
    const { options, selected, height, breakpoint = 150 } = this.props;
    return parseInt(height, 10) >= breakpoint ? (
      <ListSelect options={options} value={selected} action={this.onListSelect} />
    ) : (
      <SimpleSelect options={options} value={selected} action={this.onSelect} />
    );
  }

  onSelect = (e, i, value) => {
    this.props.action(value);
  };
  onListSelect = (e, value) => {
    this.props.action(value);
  };
}
