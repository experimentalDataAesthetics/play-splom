# PlaySPLOM

status: ALPHA / Work in Progress

This application explores multi-variate datasets through scatter plot matrices and multi-parameter sonification. It is a downloadable, cross-platform application for visualization and sonification.

Scatterplot matrices are a way to roughly determine if you have a linear correlation between multiple variables.

Sound events are spawned when you brush over plotted data points. Many sounds are included and the  and sonification mapping controls are all

### Features

- Load CSV datasets
- Plot scatterplots for each combination of data features
- Automatically parses well-formed datetimes
- Sonifies datapoints as you brush over them
- Includes embedded SuperCollider synthesis engine
- Many sounds included (more to come)
- Selectable sounds and adjustable sound parameters
- Adjustable data -> sound parameter mapping
- Play sounds in loop mode: the dataset is treated as a sequence

Some background to the project is described here:

https://medium.com/@crucialfelix/experimental-data-aesthetics-4563d01a5ebb#.3oirsvtq1

### Try it out

Easiest is to download the [latest release from github](https://github.com/experimentalDataAesthetics/play-splom/releases)

- Click and drag on any plot to create a brush and move it around.
- command-click on a plot to start or change looping.

## Architecture

It is built on [Electron](http://electron.atom.io/), so it is a desktop app for OS X / Windows / Linux written in [Node.js](https://nodejs.org/)

The interface and plots are written in [React.js](https://facebook.github.io/react/) with [Redux](http://redux.js.org/) and [Reselect](https://github.com/reactjs/reselect).

[D3.js](https://d3js.org/) is used only for some scaling functions - the SVG nodes are rendered with React. There were some tradeoffs here between ease of data flow (with React and Redux) and just grabbing a D3 demo and hooking in some handlers to it. I opted to have full application control using React. D3 is nice for simple examples but it gets messy when you want to scale up application complexity.

The sound engine is [SuperCollider](http://supercollider.github.io/) controlled by [supercollider.js](https://github.com/crucialfelix/supercolliderjs)

All groups, synths, synthdefs and sequencing are managed by the new work-in-progress [Dryadic](https://github.com/crucialfelix/dryadic) library. This is a way to write declarative documents in JSON (from any language) that specify all the synths, connections, resources that you want playing and then it plays it. If you update the document then the server updates accordingly.

This application is the first real use of that library and is an exploration and demonstration of how supercollider.js apps can be written with Electron.

That said if you are not knee deep in contemporary (mid-August 2016) ES6/ES7/JSX JavaScript erm ... ECMAScript, webpacking, jsx, juggling transpiling wonder-of-the-week technology then this isn't the simplest example to just show supercollider.js running in Electron. There is a lot of stuff here to wonder and learn about. By mid-september some of it will be no longer current.

The supercollider.js / dryadic part will become even simpler once updating/streams and remote clients are implemented.

## Installation

To just play with it, download the most recent release.

These instructions are for those who want to hack or explore the code.

### Node JS

You should use `nodejs` >= `6.9.1`

Probably the lastest in the 6 series (LTM) but the latest should work as well. I developed using 6.9.1

The code is all transpiled anyway, so the latest language features aren't needed.

The best way to install `node` is to use `nvm`:

https://github.com/creationix/nvm

This allows you to install different node versions and easily to switch between them.

    nvm install 6.9.1

Switch to it:

    nvm use 6.9.1

Now when you run `node` it is the `6.9.1` version

### play-splom

Install this app:

    npm install

[SuperCollider](https://supercollider.github.io) is included by manually putting a prebuilt version into `app/vendor/supercollider`

Later on a prebuilt version will be installable automatically by npm (node package manager), but for now it has to be put in there.

```sh
> app/vendor
└── supercollider
    ├── COPYING
    ├── README.md
    └── osx
        ├── MacOS
        │   ├── libFLAC.8.dylib
        │   ├── libogg.0.dylib
        │   ├── libreadline.6.dylib
        │   ├── libsndfile.1.dylib
        │   ├── libvorbis.0.dylib
        │   └── libvorbisenc.2.dylib
        ├── bin
        │   ├── plugins
        │   │   ├── BinaryOpUGens.scx
        │   │   ├── ChaosUGens.scx
        │   │   ├── DelayUGens.scx
        │   │   ├── DemandUGens.scx
        │   │   ├── DiskIO_UGens.scx
        │   │   ├── DynNoiseUGens.scx
        │   │   ├── FFT_UGens.scx
        │   │   ├── FilterUGens.scx
        │   │   ├── GendynUGens.scx
        │   │   ├── GrainUGens.scx
        │   │   ├── IOUGens.scx
        │   │   ├── LFUGens.scx
        │   │   ├── ML_UGens.scx
        │   │   ├── MulAddUGens.scx
        │   │   ├── NoiseUGens.scx
        │   │   ├── OscUGens.scx
        │   │   ├── PV_ThirdParty.scx
        │   │   ├── PanUGens.scx
        │   │   ├── PhysicalModelingUGens.scx
        │   │   ├── ReverbUGens.scx
        │   │   ├── TestUGens.scx
        │   │   ├── TriggerUGens.scx
        │   │   ├── UIUGens.scx
        │   │   ├── UnaryOpUGens.scx
        │   │   └── UnpackFFTUGens.scx
        │   ├── scsynth
        │   └── synthdefs
        └── scsynth
```

Where the outer `scsynth` is a script that launches the actual `scsynth` binary:

```
#!/bin/bash
DIR="${BASH_SOURCE%/*}/bin";
if [[ -z "$@" ]]; then
  ARGS="-u 57110";
else
  ARGS="$@";
fi
if [[ -z "$SC_SYNTHDEF_PATH" ]]; then
  export SC_SYNTHDEF_PATH="$DIR/synthdefs/"
fi
export SC_PLUGIN_PATH="$DIR/plugins/";
exec "$DIR/scsynth" $ARGS;
```

## Run

    yarn run start

This will compile and open an Electron app in development mode with hot loading of code and stylesheets.

`Alt-Command-i` will open Chrome Devtools

To install the extra devtools, open a console inside the Electron app and run:

```
require('electron-react-devtools').install();
require('devtron').install();
```

You only have to do this once; it should be there each time you open up this copy of Electron for development.

## Build

    yarn run build

## Architecture

A more technical overview of the architecture will follow.

The frontend is fairly standard React, Redux, Reselect
