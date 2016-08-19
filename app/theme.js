import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import u from 'updeep';

// https://coolors.co/a4b2b2-363636-5eb1bf-e0e1dd-ff6b6b

const customize = {
  palette: {
    canvasColor: '#E0E1DD',
    textColor: '#363636',
    // buttons
    primary1Color: '#FF6B6B',
    disabledColor: '#eeeeee'
  },
  spacing: {
    desktopDrawerMenuItemHeight: 12
  },
  // axis
  tableRow: {
    borderColor: '#A4B2B2'
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
