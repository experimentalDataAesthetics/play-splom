
Spec.specs.put(\freqOffset, ControlSpec.new(40, 18000, 'exp', 0, 0));

SynthDef(\klanker, { arg out=0, freqOffset=0, timeScale=1, pan=0;
    var sig, grain, env, sum, filt, pan1, pan2;

    sig = DynKlank.ar(`[
      Array.geom(14, 432, 1.3),
      Array.fill(14,{ExpRand(0.128, 0.7)}),
      Array.fill(14,{ExpRand(0.128, 0.7)})
    ], Impulse.ar(0),
      freqoffset: freqOffset
    );

    env = EnvGen.kr(
      Env.perc(0.03, 1, 0.25, 4),
      timeScale: timeScale,
      doneAction: 2);

    filt = sig;
    sum = filt * env;

    sum = Pan2.ar(sum, pan);
    OffsetOut.ar(out, sum * 0.5);
}).add;
