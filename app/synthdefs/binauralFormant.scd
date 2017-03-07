Spec.specs.put(\sustain, ControlSpec.new(0.02, 1, 'exp', 0, 0.2));
Spec.specs.put(\freqL, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\freqR, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\formFreq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\bandwidth, ControlSpec(40, 6000, 'exp', 0, 440, " Hz"));

SynthDef("binauralFormant", { |out, freqL=440, freqR=440, formFreq=1760, bandwidth=800, sustain=0.2, amp=0.25|
  var snd = [
    Formant.ar(freqL, formFreq, bandwidth),
    Formant.ar(freqR, formFreq, bandwidth)
  ];
  var env = snd * EnvGen.kr(Env.perc(0.001, sustain), doneAction: 2) * amp;
  OffsetOut.ar(out, snd * env);
}, \ir ! 7).add;
