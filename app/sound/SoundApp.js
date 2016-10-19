
import * as sc from 'supercolliderjs';
import * as _ from 'lodash';
import path from 'path';
import fs from 'fs';
import Bacon from 'baconjs';
import jetpack from 'fs-jetpack';
import watch from 'watch';

/**
 * config is loaded from config/(development|production|test).json
 *
 * You can set options to pass in supercollider options,
 * specifically a path to a working sclang which will then be used
 * to compile synthDefs. If not set (the default) then the app will
 * only load pre-compiled synthDefs from ./synthdefs
 */
import config from '../../config';


const options = _.assign({}, config.supercolliderjs.options || {}, {
  // sclang: path.join(config.appRoot, 'vendor/supercollider/osx/sclang'),
  // This copy was still not portable due to Qt dylib errors:
  // so it requires that a path to an external SuperCollider.app is supplied
  // in config/development.json
  scsynth: path.join(config.appRoot, 'vendor/supercollider/osx/scsynth'),
  serverPort: 58000,
  echo: true,  // wonky. this means post osc messages to console
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
      amp: 0.5
    };
  }

  start(synthDefsDir) {
    // should be the same:
    // const sdd = path.join(config.appRoot, 'synthdefs');
    return new Promise((resolve, reject) => {
      fs.readdir(synthDefsDir, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        const hasSclang = Boolean(config.supercolliderjs.options.sclang)
        && process.env.NODE_ENV === 'development';
        // hasSclang = true;

        // dryadic document
        const synthDef = (name) => {
          let opts;
          if (hasSclang) {
            opts = {
              compileFrom: path.join(synthDefsDir, `${name}.scd`),
              saveToDir: synthDefsDir,
              watch: true
            };
          } else {
            opts = {
              loadFrom: path.join(synthDefsDir, `${name}.scsyndef`)
            };
          }

          return ['scsynthdef', opts];
        };

        const defs = files
          .filter((p) => path.extname(p) === '.scd')
          .map((p) => path.basename(p, '.scd'))
          .filter((name) => !(_.includes(['master', 'mixToMaster'], name)))
          .map(synthDef);

        const mixToMaster = [
          'synth',
          {
            def: synthDef('mixToMaster'),
            args: {
              in: (context) => context.out,
              out: 0
            }
          }
        ];

        const audiobus = (children) => [
          'audiobus',
          {
            numChannels: 2
          },
          children.concat([mixToMaster])
        ];

        const body = [
          ['synthstream', {
            stream: this.synthStream
          }],
          ['syntheventlist', {
            updateStream: this.loopModeEventStream
          }],
          [
            'synth',
            {
              def: synthDef('master'),
              args: this.masterArgs
            },
            [
              ['synthcontrol', {
                stream: this.masterControlStream
              }]
            ]
          ]
        ];

        const server = [
          'scserver',
          {
            options
          },
          defs.concat([audiobus(body)])
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
    // if (this.player) {
    //   return this.player.stop();
    // }
  }

  spawnSynth(event) {
    this.synthStream.push(event);
  }

  spawnSynths(synthEvents) {
    this.log.debug(synthEvents);
    synthEvents.forEach((synthEvent) => this.synthStream.push(synthEvent));
  }

  /**
   * Push the object to the BaconJS loopModeEventStream which is connected to the SynthEventList.
   *
   * @param {Object} payload -
   *        events:
   *        epoch:
   *        loopTime:
   */
  setLoop(payload) {
    this.loopModeEventStream.push(payload);
  }

  setMasterControls(event) {
    this.masterControlStream.push(event);
  }

  /**
   * Read sounds metadata files and dispatch setSounds action to renderer process.
   */
  loadSounds(synthDefsDir, dispatch) {
    return new Promise((resolve, reject) => {
      fs.readdir(synthDefsDir, (error, files) => {
        if (error) {
          return reject(error);
        }

        const sounds = [];

        // reject on any error ?
        // or dispatch the error
        files.forEach((p) => {
          if (path.extname(p) === '.json' && (p !== 'master.json') && (p !== 'mixToMaster.json')) {
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
        resolve();
      });
    });
  }

  watchDir(synthDefsDir, dispatch) {
    watch.watchTree(synthDefsDir, {interval: 1}, () => {
      this.loadSounds(synthDefsDir, dispatch).catch((error) => {
        console.error(error);
      });
    });
  }
}
