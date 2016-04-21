SynthDef("master", { arg out=0, amp=0.9;
  var in = In.ar(out, 2);
  var output = Limiter.ar(in * amp, 0.99);
  Out.ar(out, output);
});
