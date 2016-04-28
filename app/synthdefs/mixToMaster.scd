SynthDef("mixToMaster", { arg out=0, in=0;
  Out.ar(out, In.ar(in, 2));
});
