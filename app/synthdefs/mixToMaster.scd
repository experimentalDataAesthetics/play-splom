/**
 * Mixes bus 'out' to the physical first out: 0
 */
SynthDef("mixToMaster", { arg out=0;
  OffsetOut.ar(0, In.ar(out, 2));
});
