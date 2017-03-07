Spec.specs.put(\sustain, ControlSpec.new(0.05, 4, 'exp', 0, 1));

SynthDef("noiseburst", { |out, pan, amp=0.1, sustain=0.01|
	var snd = PinkNoise.ar(1.0);
	var amp2 = amp * AmpComp.ir(1.max(50)) * 0.5;
	var env = EnvGen.ar(Env.sine(sustain, 1.0), levelScale: amp2, doneAction: 2);
	OffsetOut.ar(out, Pan2.ar(snd * env, pan));
}, \ir ! 5).add;
