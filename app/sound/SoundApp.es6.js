
const sc = require('supercolliderjs');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const Bacon = require('baconjs').Bacon;
import config from '../../config';

/**
 * config is loaded from config/(development|production|test).json
 *
 * You can set options to pass in supercollider options,
 * specifically a path to a working sclang which will then be used
 * to compile synthDefs. If not set (the default) then the app will
 * only load pre-compiled synthDefs from ./synthdefs
 */

const options = _.defaults(config.supercolliderjs.options || {}, {
  // sclang: path.join(__dirname, 'vendor/supercollider/osx/sclang'),
  // This copy was still not portable due to Qt dylib errors:
  // so it requires that a path to an external SuperCollider.app is supplied
  // in config/development.json
  scsynth: path.join(__dirname, 'vendor/supercollider/osx/scsynth'),
  echo: false,
  debug: false,
  includePaths: [],
  sclang_conf: null
});

const synthDefsDir = path.join(__dirname, '../', config.synthDefsDir);

/**
 * Runs in the background.js process
 *
 * Uses supercollider.js to spawn a tree of synths/groups
 * and has streams that can be pushed to.
 */
export default class SoundApp {

  constructor() {
    this.synthStream = new Bacon.Bus();
    this.masterControlStream = new Bacon.Bus();
    this.masterArgs = {
      def: 'master',
      args: {
        amp: 0.5
      }
    };
  }

  start() {
    fs.readdir(synthDefsDir, (err, files) => {
      if (err) {
        throw new Error(err);
      }

      // TODO: if production then load compiled *.scsyndef
      // different options
      const defs = files
        .filter((p) => path.extname(p) === '.scd')
        .map((p) => [
          'scsynthdef',
          {
            compileFrom: path.join(synthDefsDir, p),
            saveToDir: synthDefsDir,
            watch: Boolean(config.supercolliderjs.options.sclang)
          }
        ]);

      this.root = sc.h(
        ['sclang', options, [
          ['scserver', options,
            defs.concat([
              ['group', [
                // needs to mix back to master
                ['audiobus', { numChannels: 2 }, [
                  ['synthstream', { stream: this.synthStream }],
                  ['synth', this.masterArgs, [
                    ['synthcontrol', {
                      stream: this.masterControlStream
                    }]
                  ]]
                ]]
              ]]
            ])
        ]]
      ]);

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
    synthEvents.forEach((synthEvent) => this.synthStream.push(synthEvent));
  }

  setMasterControls(event) {
    this.masterControlStream.push(event);
  }
}
