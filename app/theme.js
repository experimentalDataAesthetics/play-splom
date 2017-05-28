import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import u from 'updeep';

// light
// https://coolors.co/a4b2b2-363636-5eb1bf-e0e1dd-ff6b6b
// const light = {
//   palette: {
//     canvasColor: '#E0E1DD',
//     textColor: '#363636',
//     // buttons
//     primary1Color: '#FF6B6B',
//     disabledColor: '#eeeeee',
//     active: '#FF6B6B',
//     point: '#A4B2B2'
//   },
//   spacing: {
//     desktopDrawerMenuItemHeight: 12
//   },
//   // axis
//   tableRow: {
//     borderColor: '#A4B2B2'
//   }
// };

const dark = {
  palette: {
    canvasColor: '#292729',
    textColor: '#8b8b8b',
    // radio-button
    primary1Color: '#6bff8c',
    disabledColor: '#4b4d48',
    active: '#6bff8c',
    point: '#606767',
    title: '#786f6f'
  },
  spacing: {
    desktopDrawerMenuItemHeight: 8
  },
  // L axis
  tableRow: {
    borderColor: '#424b4e'
  }
};

const customize = dark;

const makeMuiTheme = base => {
  const t = u(customize, base);
  return getMuiTheme(t);
};

export default function defaultTheme() {
  const t = makeMuiTheme(baseTheme);
  console.log(t);
  return t;
}
