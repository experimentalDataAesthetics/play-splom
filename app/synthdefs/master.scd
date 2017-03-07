/*https://github.com/adcxyz/SafetyNet/blob/master/Classes/ReplaceBadValues.sc*/
var replaceBadValues = { |in, sub = 0, id = 0,  post = 2|
  var subIndex =  CheckBadValues.ar(in, id, post) > 0;
  // prepare for Select
  sub = sub.asArray.collect { |sub1|
    if (sub1.rate != \audio) { sub = K2A.ar(sub) } { sub };
  };
  Select.ar(subIndex, [in, sub]);
};

SynthDef("master", { arg out=0, amp=0.9;
  var in = In.ar(out, 2);
  var zapped = replaceBadValues.value(in) * amp;
  var compressed =
    Compander.ar(zapped, zapped,
      thresh: 0.9,
      slopeBelow: 1,
      slopeAbove: 0.5,
      clampTime: 0.01,
      relaxTime: 0.01
    );
  var output = Limiter.ar(compressed, 0.99);
  output = LeakDC.ar(output, 0.995);
  OffsetOut.ar(out, output);
});
