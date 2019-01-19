export default function Profiler() {
  let times = [],
    labels = [],
    intervals = [];

  this.addTime = function(label) {
    const d = new Date();
    const curTime = d.getTime();

    if (times.length !== 0) {
      intervals.push(curTime - times[times.length - 1]);
    }

    times.push(curTime);
    labels.push(label);
  };

  this.toString = function() {
    let out = '';
    for (let i = 0; i < intervals.length; i++) {
      out = out + labels[i] + ': ' + intervals[i] + '\n';
    }

    return out;
  };

  this.clear = function() {
    labels = [];
    intervals = [];
    times = [];
  };
}
