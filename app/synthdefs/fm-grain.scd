Spec.specs.put(\carrierFreq, ControlSpec.new(40, 9000, 'exp', 0, 0));
Spec.specs.put(\modulatorFreq, ControlSpec.new(40, 9000, 'exp', 0, 0));
Spec.specs.put(\modulatorIndex, ControlSpec.new(0, 10, 'lin', 0, 0));


SynthDef("fm-grain", { arg out=0, carrierFreq=440, modulatorFreq=10, modulatorIndex=0, timeScale=1.0;

  var amp, modulator, carrier;

  amp = EnvGen.kr(Env.sine(0.1, 0.2),
              timeScale: timeScale,
              doneAction: 2);

  modulator = SinOsc.ar(freq: modulatorFreq, mul: modulatorIndex * modulatorFreq);
  carrier = SinOsc.ar(freq: carrierFreq + modulator, mul: amp);

  OffsetOut.ar(out, [carrier, carrier]);

}).add;
