
export function minSide(el) {
  return Math.min(el.clientWidth, el.clientHeight);
}

export function windowSize() {
  var w = window;
  var d = document;
  var e = d.documentElement;
  var g = d.getElementsByTagName('body')[0];
  var x = w.innerWidth || e.clientWidth || g.clientWidth;
  var y = w.innerHeight || e.clientHeight || g.clientHeight;
  return {width: x, height: y};
}

export function rnd(min, max) {
  return Math.random() * (max - min) + min;
}
