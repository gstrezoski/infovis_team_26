import * as d3 from 'd3';

class Fader {
  constructor(numStep, timeStep) {
    this.numStep = numStep;
    this.timeStep = timeStep;
  }

  fade(obj, st, en, callback) {
    let stepSize = (en - st) / this.numStep;
    this._do_fade(obj, st, en, stepSize, callback);
  }

  _do_fade(obj, v, en, step, callback) {
    if (step > 0 && v >= en || step < 0 && v <= en) { v = en; }
    obj.style('opacity', v);
    let that = this;
    if (step > 0 && v < en || step < 0 && v > en) {
      setTimeout(() => {
        that._do_fade(obj, v+step, en, step, callback);
      }, that.timeStep);
    } else {
      if (callback) { callback(); }
    }
  }
}

const fader = new Fader(3, 10);

export default function() {
  d3.select('a.helper-container')
    .on('click', () => {
      let icon = d3.select('i.helper-icon');
      let comp = d3.selectAll('.component');
      let ht = d3.selectAll('div.helper-text');

      icon.classed('fa-question', !icon.classed('fa-question'));
      icon.classed('fa-times', !icon.classed('fa-times'));

      if (comp.style('opacity') === '0.3') {
        fader.fade(ht, 1, 0, () => {
          ht.style('display', 'none');
          comp.style('opacity', 1);
        });
      } else {
        comp.style('opacity', 0.3);
        ht.style('display', 'block');
        fader.fade(ht, 0, 1);
      }
    });
}
