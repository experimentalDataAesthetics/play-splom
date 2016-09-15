
Spec.specs.put(\fundfreq, ControlSpec.new(40, 10240, 'exp', 0, 0));
Spec.specs.put(\squelchSpeed, ControlSpec.new(0, 20, 'lin', 0, 0));
Spec.specs.put(\squelchAmount, ControlSpec.new(40, 10240, 'exp', 0, 0));

SynthDef("siren-grain", { arg out=0, fundfreq=440, squelchSpeed=0.5, squelchAmount=100, timeScale=1, pan=0;
  var modulator, tone, amp, env, envd, panned;

  modulator = LFCub.kr(squelchSpeed).range(fundfreq, fundfreq + squelchAmount);
  tone = LFCub.ar(modulator);

  /*env = Env.perc(0.03, 0.01, 0.25, 4);*/
  /*env = Env.perc;*/
  env = Env.sine(0.5, 0.2);
  amp = EnvGen.kr(env,
                timeScale: timeScale,
                doneAction: 2);

  envd = tone * amp;
  panned = Pan2.ar(envd * AmpCompA.kr(fundfreq, 0.2, 0.7), pan);

  OffsetOut.ar(out, panned);
}).add;
