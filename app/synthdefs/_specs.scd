Crucial.initSpec();

/*Spec.specs.put(\freq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));*/
Spec.specs.put(\carfreq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\modfreq, ControlSpec(40, 10000, 'exp', 0, 440, " Hz"));
Spec.specs.put(\dB, ControlSpec(-160, 0.0, 'db', 0.0, -40, " dB"));

Spec.specs.put(\springfac, ControlSpec(0.1, 1500, 'lin'));
Spec.specs.put(\damp, ControlSpec(0.00001, 0.2, 'exp'));
