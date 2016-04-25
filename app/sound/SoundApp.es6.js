
const sc = require('supercolliderjs');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const Bacon = require('baconjs').Bacon;
const jetpack = require('fs-jetpack');

import config from '../../config';

/**
 * config is loaded from config/(development|production|test).json
 *
 * You can set options to pass in supercollider options,
 * specifically a path to a working sclang which will then be used
 * to compile synthDefs. If not set (the default) then the app will
 * only load pre-compiled synthDefs from ./synthdefs
 */

const options = _.assign({}, config.supercolliderjs.options || {}, {
  // sclang: path.join(__dirname, 'vendor/supercollider/osx/sclang'),
  // This copy was still not portable due to Qt dylib errors:
  // so it requires that a path to an external SuperCollider.app is supplied
  // in config/development.json
  scsynth: path.join(__dirname, '../', 'vendor/supercollider/osx/scsynth'),
  echo: true,  // wonky. this means post osc
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
export default class SoundApp {

  constructor(log) {
    this.synthStream = new Bacon.Bus();
    this.masterControlStream = new Bacon.Bus();
    this.loopModeEventStream = new Bacon.Bus();
    this.playing = false;
    this.log = log;

    this.masterArgs = {
      args: {
        amp: 0.5
      }
    };
  }

  start(synthDefsDir) {
    return new Promise((resolve, reject) => {
      fs.readdir(synthDefsDir, (err, files) => {
        if (err) {
          throw new Error(err);
        }

        let hasSclang = Boolean(config.supercolliderjs.options.sclang)
        && process.env.NODE_ENV === 'development';
        hasSclang = false;

        const defs = files.filter((p) => path.extname(p) === '.scd')
          .map((p) => {
            let opts;
            if (hasSclang) {
              opts = {
                compileFrom: path.join(synthDefsDir, p),
                saveToDir: synthDefsDir,
                watch: true
              };
            } else {
              opts = {
                loadFrom: path.join(synthDefsDir, `${path.basename(p, '.scd')}.scsyndef`)
              };
            }

            return ['scsynthdef', opts];
          });

        // TODO: needs to mix back to master
        // const audiobus = (children) => ['audiobus', { numChannels: 2 }, children];

        const masterArgs = _.assign({
          def: sc.h([
            'scsynthdef',
            hasSclang ? {
              compileFrom: path.join(synthDefsDir, 'master'),
              saveToDir: synthDefsDir
            } : {
              loadFrom: path.join(synthDefsDir, 'master.scsyndef')
            }
          ])
        }, this.masterArgs);

        const body = [
          ['synthstream', { stream: this.synthStream }],
          ['syntheventlist', {
            updateStream: this.loopModeEventStream
          }],
          ['synth', masterArgs, [
            ['synthcontrol', {
              stream: this.masterControlStream
            }]
          ]]
        ];

        const server = [
          'scserver',
          { options },
          defs.concat([
            ['group', body]
          ])
        ];

        if (hasSclang) {
          this.root = sc.h(['sclang', { options }, [server]]);
        } else {
          this.root = server;
        }

        this.player = sc.dryadic(this.root, [], {log: this.log});
        this.player.play().then(() => {
          this.playing = true;
          resolve();
        }, reject);
      });
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
    this.log.debug(synthEvents);
    synthEvents.forEach((synthEvent) => this.synthStream.push(synthEvent));
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

  clearSched() {
    // console.log(this.player);
  }

  /**
   * Read sounds metadata files and dispatch setSounds action to renderer process.
   */
  loadSounds(synthDefsDir, dispatch) {
    fs.readdir(synthDefsDir, (err, files) => {
      if (err) {
        throw new Error(err);
      }

      const sounds = [];

      files.forEach((p) => {
        if (path.extname(p) === '.json' && (p !== 'master.json')) {
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
