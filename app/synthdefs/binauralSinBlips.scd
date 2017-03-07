Spec.specs.put(\sustain, ControlSpec.new(0.05, 4, 'exp', 0, 1));
Spec.specs.put(\freqL, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\freqR, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));

SynthDef("binauralSinBlips", { |out, freqL=440, freqR=440, sustain=0.01, amp=0.5|
	var snd = [
		PSinGrain.ar(freqL, sustain, amp) * AmpComp.ir(freqL.max(50)),
		PSinGrain.ar(freqR, sustain, amp) * AmpComp.ir(freqR.max(50))
	];
	var env = snd * EnvGen.kr(Env.sine(sustain), doneAction: 2);
	OffsetOut.ar(out, snd * env);
}, \ir ! 5).add;
