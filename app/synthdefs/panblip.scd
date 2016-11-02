Spec.specs.put(\pan, ControlSpec.new(-1, 1, 'lin', 0, 0));
Spec.specs.put(\sweep, ControlSpec.new(-5000, 5000, 'lin', 0, 1));
Spec.specs.put(\dur, ControlSpec.new(0.01, 0.3, 'exp', 0, 0.05));

SynthDef(\panblip, { arg out, pan, verb, freq=500, sweep=1000, dur=0.25;
  OffsetOut.ar(out,
    Pan2.ar(
      SinOsc.ar(Line.kr(freq, (freq + sweep).clip(1, 20000), dur, doneAction: 2), 0, dur),
      pan
    ) * 0.7,
  )
}, \ir ! 6).add;
