'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sc = require('supercolliderjs');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const Bacon = require('baconjs').Bacon;
const jetpack = require('fs-jetpack');

/**
 * config is loaded from config/(development|production|test).json
 *
 * You can set options to pass in supercollider options,
 * specifically a path to a working sclang which will then be used
 * to compile synthDefs. If not set (the default) then the app will
 * only load pre-compiled synthDefs from ./synthdefs
 */

const options = _.assign({}, _config2.default.supercolliderjs.options || {}, {
  // sclang: path.join(__dirname, 'vendor/supercollider/osx/sclang'),
  // This copy was still not portable due to Qt dylib errors:
  // so it requires that a path to an external SuperCollider.app is supplied
  // in config/development.json
  scsynth: path.join(__dirname, '../', 'vendor/supercollider/osx/scsynth'),
  echo: true, // wonky. this means post osc
  debug: true,
  includePaths: [],
  sclang_conf: null
});

/**
 * Runs in the background.js process
 *
 * Uses supercollider.js to spawn a tree of synths/groups
 * and has streams that can be pushed to.
 */
class SoundApp {

  constructor(log) {
    this.synthStream = new Bacon.Bus();
    this.masterControlStream = new Bacon.Bus();
    this.loopModeEventStream = new Bacon.Bus();
    this.playing = false;
    this.log = log;

    this.masterArgs = {
      amp: 0.5
    };
  }

  start(synthDefsDir) {
    return new Promise((resolve, reject) => {
      fs.readdir(synthDefsDir, (err, files) => {
        if (err) {
          throw new Error(err);
        }

        const hasSclang = Boolean(_config2.default.supercolliderjs.options.sclang) && process.env.NODE_ENV === 'development';
        // hasSclang = true;

        const synthDef = name => {
          let opts;
          if (hasSclang) {
            opts = {
              compileFrom: path.join(synthDefsDir, `${ name }.scd`),
              saveToDir: synthDefsDir,
              watch: true
            };
          } else {
            opts = {
              loadFrom: path.join(synthDefsDir, `${ name }.scsyndef`)
            };
          }

          return ['scsynthdef', opts];
        };

        const defs = files.filter(p => path.extname(p) === '.scd').map(p => path.basename(p, '.scd')).filter(name => !_.includes(['master', 'mixToMaster'], name)).map(synthDef);

        const mixToMaster = ['synth', {
          def: sc.h(synthDef('mixToMaster')),
          args: {
            in: context => context.out,
            out: 0
          }
        }];

        const audiobus = children => ['audiobus', {
          numChannels: 2
        }, children.concat([mixToMaster])];

        const body = [['synthstream', {
          stream: this.synthStream
        }], ['syntheventlist', {
          updateStream: this.loopModeEventStream
        }], ['synth', {
          def: sc.h(synthDef('master')),
          args: this.masterArgs
        }, [['synthcontrol', {
          stream: this.masterControlStream
        }]]]];

        const server = ['scserver', {
          options: options
        }, defs.concat([audiobus(body)])];

        if (hasSclang) {
          this.root = sc.h(['sclang', { options: options }, [server]]);
        } else {
          this.root = server;
        }

        this.player = sc.dryadic(this.root, [], { log: this.log });
        this.player.play().then(() => {
          this.playing = true;
          resolve();
        }, reject);
      });
    });
  }

  stop() {
    // if (this.player) {
    //   return this.player.stop();
    // }
  }

  spawnSynth(event) {
    this.synthStream.push(event);
  }

  spawnSynths(synthEvents) {
    this.log.debug(synthEvents);
    synthEvents.forEach(synthEvent => this.synthStream.push(synthEvent));
  }

  /**
   * events: epoch:
   */
  setLoop(payload) {
    this.clearSched();
    this.loopModeEventStream.push(payload);
  }

  setMasterControls(event) {
    this.masterControlStream.push(event);
  }

  clearSched() {}
  // console.log(this.player);


  /**
   * Read sounds metadata files and dispatch setSounds action to renderer process.
   */
  loadSounds(synthDefsDir, dispatch) {
    fs.readdir(synthDefsDir, (err, files) => {
      if (err) {
        throw new Error(err);
      }

      const sounds = [];

      files.forEach(p => {
        if (path.extname(p) === '.json' && p !== 'master.json' && p !== 'mixToMaster.json') {
          const fullpath = path.join(synthDefsDir, p);
          const data = jetpack.read(fullpath, 'json');
          data.path = fullpath;
          sounds.push(data);
        }
      });

      dispatch({
        type: 'SET_SOUNDS',
        payload: sounds
      });
    });
  }
}
exports.default = SoundApp;
module.exports = exports['default'];

