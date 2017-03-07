Spec.specs.put(\sustain, ControlSpec.new(0.05, 4, 'exp', 0, 1));

SynthDef("shockwave-microsound-2", { |out, freq=440, pan, sustain=0.01, amp=0.1|
	var snd = FSinOsc.ar(freq);
	var amp2 = amp * AmpComp.ir(freq.max(50)) * 0.5;
	var env = EnvGen.ar(Env.sine(sustain, amp2), doneAction: 2);
	OffsetOut.ar(out, Pan2.ar(snd * env, pan));
}, \ir ! 5).add;
