
const sc = require('supercolliderjs');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const Bacon = require('baconjs').Bacon;
const env = require('./vendor/electron_boilerplate/env_config');

/**
 * env is loaded from config/env_(development|production|test).json
 * You can set options to pass in supercollider options,
 * specifically a path to a working sclang which will then be used
 * to compile synthDefs. If not set (the default) then the app will
 * load pre-compiled synthDefs from ./synthdefs
 */

const options = _.defaults(env.options || {}, {
  // sclang: path.join(__dirname, 'vendor/supercollider/osx/sclang'),
  // This copy was still not portable due to Qt dylib errors:
  // so it requires that a path to an external SuperCollider.app is supplied
  // in config/env_development.json
  scsynth: path.join(__dirname, 'vendor/supercollider/osx/scsynth'),
  echo: false,
  debug: false,
  includePaths: [],
  sclang_conf: null
});

const synthDefsDir = path.join(__dirname, '../', env.synthDefsDir);

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
      let defs = files
        .filter((p) => path.extname(p) === '.scd')
        .map((p) => {
          return [
            'scsynthdef',
            {
              compileFrom: path.join(synthDefsDir, p),
              saveToDir: synthDefsDir,
              watch: env.name === 'development'
            }
          ];
        });

      this.root = sc.h([
        'sclang', options, [
          [
            'scserver',
            options,
            defs.concat([
              ['group', [
                ['audiobus', {numChannels: 2}, [
                  ['synthstream', {stream: this.synthStream}],
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
    return this.player.stop();
  }

  spawnSynth(event) {
    this.synthStream.push(event);
  }

  setMasterControls(event) {
    this.masterControlStream.push(event);
  }
}
