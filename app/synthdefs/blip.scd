Spec.specs.put(\numharm, ControlSpec(1, 512, 'lin'));

SynthDef('blip', { arg out=0, freq=440, numharm=200, pan=0, timeScale=1.0, smooth=0.01, amp=1.0;
  OffsetOut.ar(out,
    Pan2.ar(
      Blip.ar(freq, numharm, amp) *
        EnvGen.kr(Env.linen(smooth, 0.1, smooth),
          timeScale: timeScale,
          doneAction: 2),
      pan
    )
  );
});
