Spec.specs.put(\sustain, ControlSpec.new(0.02, 1, 'exp', 0, 1));
Spec.specs.put(\freqL, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\freqR, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\harmonics, ControlSpec(1, 200, 'lin', 0, 1, " Harmonics"));

SynthDef("binauralBlip", { |out, amp=0.1, freqL=440, freqR=440, harmonics=1, sustain=0.01|
	var snd = [
    Blip.ar(freqL, harmonics, 0.5),
    Blip.ar(freqR, harmonics, 0.5)
	];
	var env = snd * EnvGen.kr(Env.perc(0.001, sustain), doneAction: 2);
	OffsetOut.ar(out, snd * env);
}, \ir ! 5).add;
