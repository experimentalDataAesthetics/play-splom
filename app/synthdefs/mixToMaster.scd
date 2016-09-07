SynthDef("mixToMaster", { arg out=0, in=0;
  OffsetOut.ar(out, In.ar(in, 2));
});
