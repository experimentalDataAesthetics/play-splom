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
  echo: false,
  debug: false,
  includePaths: [],
  sclang_conf: null
});

// const synthDefsDir = path.join(__dirname, '../', 'synthdefs');

/**
 * Runs in the background.js process
 *
 * Uses supercollider.js to spawn a tree of synths/groups
 * and has streams that can be pushed to.
 */
class SoundApp {

  constructor() {
    this.synthStream = new Bacon.Bus();
    this.masterControlStream = new Bacon.Bus();
    this.loopModeEventStream = new Bacon.Bus();
    this.masterArgs = {
      def: 'master',
      args: {
        amp: 0.5
      }
    };
  }

  start(synthDefsDir) {
    fs.readdir(synthDefsDir, (err, files) => {
      if (err) {
        throw new Error(err);
      }

      const hasSclang = Boolean(_config2.default.supercolliderjs.options.sclang);

      const defs = files.filter(p => path.extname(p) === '.scd').map(p => {
        let opts;
        if (hasSclang) {
          opts = {
            compileFrom: path.join(synthDefsDir, p),
            saveToDir: synthDefsDir,
            watch: true
          };
        } else {
          opts = {
            loadFrom: path.join(synthDefsDir, `${ path.basename(p) }.scsyndef`)
          };
        }

        return ['scsynthdef', opts];
      });

      const server = ['scserver', { options: options }, defs.concat([['group', [
      // TODO: needs to mix back to master
      ['audiobus', { numChannels: 2 }, [['synthstream', { stream: this.synthStream }], ['syntheventlist', {
        updateStream: this.loopModeEventStream
      }], ['synth', this.masterArgs, [['synthcontrol', {
        stream: this.masterControlStream
      }]]]]]]]])];

      if (hasSclang) {
        this.root = sc.h(['sclang', { options: options }, [server]]);
      } else {
        this.root = server;
      }

      this.player = sc.dryadic(this.root);
      this.player.play();
    });
  }

  stop() {
    if (this.player) {
      return this.player.stop();
    }
  }

  spawnSynth(event) {
    this.synthStream.push(event);
  }

  spawnSynths(synthEvents) {
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
        if (path.extname(p) === '.json' && p !== 'master.json') {
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

