'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);
console.log('config2', _config2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sc = require('supercolliderjs');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var Bacon = require('baconjs').Bacon;


/**
 * config is loaded from config/(development|production|test).json
 *
 * You can set options to pass in supercollider options,
 * specifically a path to a working sclang which will then be used
 * to compile synthDefs. If not set (the default) then the app will
 * only load pre-compiled synthDefs from ./synthdefs
 */

var options = _.defaults(_config2.default.supercolliderjs.options || {}, {
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

var synthDefsDir = path.join(__dirname, '../', _config2.default.synthDefsDir);

/**
 * Runs in the background.js process
 *
 * Uses supercollider.js to spawn a tree of synths/groups
 * and has streams that can be pushed to.
 */

var SoundApp = function () {
  function SoundApp() {
    _classCallCheck(this, SoundApp);

    this.synthStream = new Bacon.Bus();
    this.masterControlStream = new Bacon.Bus();
    this.masterArgs = {
      def: 'master',
      args: {
        amp: 0.5
      }
    };
  }

  _createClass(SoundApp, [{
    key: 'start',
    value: function start() {
      var _this = this;

      fs.readdir(synthDefsDir, function (err, files) {
        if (err) {
          throw new Error(err);
        }

        // TODO: if production then load compiled *.scsyndef
        // different options
        var defs = files.filter(function (p) {
          return path.extname(p) === '.scd';
        }).map(function (p) {
          return ['scsynthdef', {
            compileFrom: path.join(synthDefsDir, p),
            saveToDir: synthDefsDir,
            watch: Boolean(_config2.default.supercolliderjs.options.sclang)
          }];
        });

        _this.root = sc.h(['sclang', options, [['scserver', options, defs.concat([['group', [
        // needs to mix back to master
        ['audiobus', { numChannels: 2 }, [['synthstream', { stream: _this.synthStream }], ['synth', _this.masterArgs, [['synthcontrol', {
          stream: _this.masterControlStream
        }]]]]]]]])]]]);

        _this.player = sc.dryadic(_this.root);
        _this.player.play();
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.player) {
        return this.player.stop();
      }
    }
  }, {
    key: 'spawnSynth',
    value: function spawnSynth(event) {
      this.synthStream.push(event);
    }
  }, {
    key: 'spawnSynths',
    value: function spawnSynths(synthEvents) {
      var _this2 = this;

      synthEvents.forEach(function (synthEvent) {
        return _this2.synthStream.push(synthEvent);
      });
    }
  }, {
    key: 'setMasterControls',
    value: function setMasterControls(event) {
      this.masterControlStream.push(event);
    }
  }]);

  return SoundApp;
}();

exports.default = SoundApp;
module.exports = exports['default'];
