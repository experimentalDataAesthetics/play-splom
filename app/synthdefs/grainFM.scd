Spec.specs.put(\carfreq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\modfreq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\sustain, ControlSpec.new(0, 4, 'lin', 0, 1));

SynthDef("grainFM", {|out, carfreq=440, modfreq=20, moddepth = 1, sustain=0.02, amp=0.1, pan|
	var env = EnvGen.ar(Env.sine(sustain, amp), doneAction: 2);
	var sound = SinOsc.ar(carfreq, SinOsc.ar(modfreq) * moddepth) * env;
	OffsetOut.ar(out, Pan2.ar(sound, pan))
}, \ir ! 5).add;
