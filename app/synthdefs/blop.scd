
SynthDef('blop', { arg out=0, freq=440, ffreq=800, rq=0.3, pan=0, timeScale=1.0, smooth=0.01, amp=1.0;
  var fenv = EnvGen.kr(Env.linen(0.05, 0.05, 0.1));
  Out.ar(out,
    Pan2.ar(
      RLPF.ar(Saw.ar(freq, amp), ffreq * fenv, rq * fenv + 0.1) *
        EnvGen.kr(Env.linen(smooth, 0.1, smooth),
          timeScale: timeScale,
          doneAction: 2),
      pan
    )
  );
});
