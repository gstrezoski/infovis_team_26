import * as d3 from 'd3';

d3.select('a.float')
  .on('click', function() {
    let icon = d3.select('#helper-icon');
    icon.classed('fa-question', !icon.classed('fa-question'));
    icon.classed('fa-times', !icon.classed('fa-times'));

    let comp = d3.selectAll('.component');
    let hp = d3.selectAll('div.helper-text');
    if (comp.style('opacity') == 0.3) {
      comp.style('opacity', 1);
      hp.style('opacity', 0);
    } else {
      comp.style('opacity', 0.3);
      hp.style('opacity', 1);
    }
  });
