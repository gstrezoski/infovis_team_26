import * as d3 from 'd3';

d3.select('a.helper-container')
  .on('click', function() {
    let icon = d3.select('i.helper-icon');
    let comp = d3.selectAll('.component');
    let ht = d3.selectAll('div.helper-text');

    icon.classed('fa-question', !icon.classed('fa-question'));
    icon.classed('fa-times', !icon.classed('fa-times'));

    if (comp.style('opacity') == 0.3) {
      comp.style('opacity', 1);
      ht.style('opacity', 0);
      ht.style('display', 'none');
    } else {
      comp.style('opacity', 0.3);
      ht.style('opacity', 1);
      ht.style('display', 'block');
    }
  });
