import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import u from 'updeep';

const customize = {
  palette: {
    textColor: '#777777',
    // buttons
    primary1Color: '#ff0082',
    disabledColor: '#eeeeee'
  },
  spacing: {
    desktopDrawerMenuItemHeight: 12
  }
};

const makeMuiTheme = (base) => {
  const t = u(customize, base);
  return getMuiTheme(t);
};

export default function defaultTheme() {
  const t = makeMuiTheme(baseTheme);
  console.log(t);
  return t;
}
