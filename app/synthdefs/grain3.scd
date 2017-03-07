Spec.specs.put(\sustain, ControlSpec.new(0.05, 4, 'exp', 0, 1));

SynthDef("grain3", { |out, freq=440, pan, sustain=0.01, amp=0.1|
	var snd = LFSaw.ar(freq);
	var amp2 = amp * AmpCompA.ir(freq.max(50)) * 0.5;
	var env = EnvGen.ar(Env.perc(1.0, 1.0), timeScale: sustain, levelScale: amp2, doneAction: 2);
	OffsetOut.ar(out, Pan2.ar(snd, pan, env));
}, \ir ! 5).add;
