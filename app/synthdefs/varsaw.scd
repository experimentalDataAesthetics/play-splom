
Spec.specs.put(\width, ControlSpec.new(0, 1, 'lin', 0, 0));

SynthDef(\varsaw, { arg out=0, freq=440, width=0, timeScale=1, pan=0;
  var saw, envd, panned;

  saw = VarSaw.ar(freq, 0, width);

  envd = saw * EnvGen.kr(Env.sine(0.1, 0.2), timeScale: timeScale, doneAction: 2);
  panned = Pan2.ar(envd * AmpCompA.kr(freq, 0.2, 0.7), pan);

  OffsetOut.ar(out, panned);
}).add;
