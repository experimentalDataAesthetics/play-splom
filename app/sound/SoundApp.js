import { dryadic } from 'supercolliderjs/lib/dryads';
import _ from 'lodash';
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

function vendor(p) {
  return path.join(config.appRoot, 'vendor', 'supercollider', p);
}

const options = _.assign({}, config.supercolliderjs.options || {}, {
  // This copy was still not portable due to Qt dylib errors:
  // sclang: path.join(config.appRoot, 'vendor/supercollider/osx/sclang'),
  // so it requires that a path to an external SuperCollider.app is supplied
  // in config/development.json
  scsynth: vendor('osx/bin/scsynth'),
  serverPort: 58000,
  env: {
    SC_SYNTHDEF_PATH: vendor('osx/bin/synthdefs/'),
    SC_PLUGIN_PATH: vendor('osx/bin/plugins/')
  },
  echo: true, // wonky. this means post osc messages to console
  debug: false, // post sclang traffic
  includePaths: [],
  sclang_conf: null
});

const TIMEOUT = 20000;

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
      amp: 0.3
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

        this.log.info('Server options', JSON.stringify(options, null, 2));

        const hasSclang = Boolean(options.sclang) && process.env.NODE_ENV === 'development';
        // hasSclang = true;

        // dryadic document
        function synthDef(name) {
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
        }

        const defs = () => {
          return files
            .filter(p => path.extname(p) === '.scd')
            .map(p => path.basename(p, '.scd'))
            .filter(name => !_.includes(['master', 'mixToMaster'], name))
            .map(synthDef);
        };

        const mixToMaster = () => ['synth', { def: synthDef('mixToMaster') }];

        const audiobus = children => {
          return [
            'audiobus',
            {
              numChannels: 2
            },
            children.concat([mixToMaster()])
          ];
        };

        const synthStream = () => {
          return [
            'synthstream',
            {
              stream: () => this.synthStream
            }
          ];
        };

        const busContents = () => {
          return [
            synthStream(),
            [
              'syntheventlist',
              {
                updateStream: () => this.loopModeEventStream
              }
            ],
            [
              'synth',
              {
                def: synthDef('master'),
                args: this.masterArgs
              }
            ]
          ];
        };

        function server(body) {
          return [
            'scserver',
            {
              options
            },
            defs().concat([body])
          ];
        }

        function sclang(inner) {
          if (hasSclang) {
            return ['sclang', { options }, [inner]];
          } else {
            return inner;
          }
        }

        this.root = sclang(server(audiobus(busContents())));

        this.player = dryadic(this.root, [], { log: this.log });

        const die = error => {
          this.playing = false;
          this.log.error('SoundApp FAILED TO START');
          this.log.error(error);
          this.player.dump();
          reject(error);
        };

        this.player
          .play()
          .timeout(TIMEOUT)
          .then(() => {
            this.playing = true;
            resolve();
          })
          .catch(die);
      });
    });
  }

  stop() {
    if (this.player) {
      // will not actually complete because of Group and Synth
      return this.player.stop().timeout(1000);
    }

    return Promise.resolve();
  }

  spawnSynth(event) {
    this.synthStream.push(event);
  }

  spawnSynths(synthEvents) {
    // this.log.log(synthEvents);
    synthEvents.forEach(synthEvent => this.synthStream.push(synthEvent));
  }

  /**
   * Push the object to the BaconJS loopModeEventStream which is connected
   * to the SynthEventList.
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
        files.forEach(p => {
          if (path.extname(p) === '.json' && p !== 'master.json' && p !== 'mixToMaster.json') {
            const fullpath = path.join(synthDefsDir, p);
            const data = jetpack.read(fullpath, 'json');
            data.path = fullpath;
            sounds.push(data);
          }
        });

        dispatch({
          type: 'setSounds',
          payload: sounds
        });
        resolve();
      });
    });
  }

  watchDir(synthDefsDir, dispatch) {
    watch.watchTree(synthDefsDir, { interval: 1 }, () => {
      this.loadSounds(synthDefsDir, dispatch).catch(error => {
        console.error(error);
      });
    });
  }
}
