
Spec.specs.put(\syncOffset, ControlSpec.new(0, 2, 'lin', 0, 0));

SynthDef(\syncsaw, { arg out=0, freq=440, syncOffset=0, timeScale=1, pan=0;
  var saw, envd, panned;

  saw = SyncSaw.ar(freq, freq * syncOffset + freq);

  envd = saw * EnvGen.kr(Env.sine(0.1, 0.2), timeScale: timeScale, doneAction: 2);
  panned = Pan2.ar(envd * AmpCompA.kr(freq, 0.2, 0.7), pan);

  OffsetOut.ar(out, panned);
}).add;
