Spec.specs.put(\sustain, ControlSpec.new(0.05, 4, 'exp', 0, 1));
Spec.specs.put(\freqL, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\freqR, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));

SynthDef("binauralLFSaw", { |out, freqL=440, freqR=440, sustain=0.01, amp=0.1|
	var snd = [LFSaw.ar(freqL), LFSaw.ar(freqR)];
	var amp2 = amp * AmpComp.ir(freqL.max(50)) * 0.5;
	var env = EnvGen.ar(Env.perc(1.0, 1.0), timeScale: sustain, levelScale: amp2, doneAction: 2);
	OffsetOut.ar(out, snd * env);
}, \ir ! 5).add;
