
// http://sccode.org/1-4Xa
Spec.specs.put(\timeScale, ControlSpec.new(0.05, 1, 'exp', 0, 0));
Spec.specs.put(\ffreq, ControlSpec.new(40, 9000, 'exp', 0, 0));

SynthDef(\fflit, {arg out, freq, ffreq, pan, timeScale;
  Out.ar(out,
    Pan2.ar(
      RLPF.ar(
        Saw.ar(freq,
          EnvGen.kr(Env.perc(0.03, 0.01, 0.25, 4),
            levelScale: 0.5,
            timeScale: timeScale,
            doneAction: 2)),
        ffreq * EnvGen.kr(Env.asr(0.001, 1, 0.0001, 4), doneAction: 2),
        EnvGen.kr(Env.asr(0.01, 1, 0.01, 4), timeScale: timeScale).range(0.02, 0.2)
      ),
      pan
    )
  )
}).add;
