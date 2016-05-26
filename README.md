# PlaySPLOM

status: ALPHA

## Install

### Node

You should use `nodejs` >= `4.2.0`

The best way to install `node` is to use `nvm`:

https://github.com/creationix/nvm

This allows you to install different node versions and easily to switch between them.

    nvm install 4.2.1

Switch to it:

    nvm use 4.2.1

Now when you run `node` it is the `4.2.1` version

### PlaySPLOM

Install this app:

    npm install

[SuperCollider](https://supercollider.github.io) is included by manually putting a prebuilt version into `app/vendor/supercollider`
Later on this will be installable automatically by npm (node package manager), but for now use the google drive version.

## Run

    npm run dev

This will compile and open an Electron app in development mode.


`Alt-Command-i` will open Chrome Devtools

`Ctrl-h` will open the [Redux-Devtools](https://github.com/gaearon/redux-devtools)

To install the extra devtools, open a console inside the Electron app and run:

```
require('electron-react-devtools').install();
require('devtron').install();
```

## Build

    npm run build
