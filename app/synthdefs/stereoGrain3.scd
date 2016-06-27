Spec.specs.put(\sustain, ControlSpec.new(0, 4, 'lin', 0, 1));
Spec.specs.put(\freq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\freq2, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));

SynthDef("stereoGrain3", { |out, amp=0.1, freq=440, freq2=440, sustain=0.01|
	var snd = [LFSaw.ar(freq), LFSaw.ar(freq2)];
	var amp2 = amp * AmpComp.ir(freq.max(50)) * 0.5;
	var env = EnvGen.ar(Env.perc(1.0, 1.0), timeScale: sustain, levelScale: amp2, doneAction: 2);
	OffsetOut.ar(out, snd * env);
}, \ir ! 5).add;
