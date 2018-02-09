'use strict';

import * as d3 from 'd3';

import barchart_data from '_data/barchart-data.tsv';

export default class BarchartController {
  constructor($timeout) {
    'ngInject';
    this.$timeout = $timeout;
  }

  $postLink() {
    // Wrap in a timeout to only load when the DOM has rendered
    // 100ms is crude, but short enough to have the svg size calculated correctly.
    this.$timeout(this.render, 100);

    // Add a listener to resize events of the window (then we should redraw)
    window.addEventListener('resize', this.render);
  }

  render() {
    const svg = d3.select('svg.bar-chart'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      box = svg.node().getBoundingClientRect(),
      width = box['width'] - margin.left - margin.right,
      height = box['height'] - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear()
        .rangeRound([height, 0]);

    svg.selectAll('g').remove();

    const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.tsv(barchart_data, (d) => {
      d.frequency = +d.frequency;
      return d;
    }, (error, data) => {
      if (error) { throw error; }

      x.domain(data.map((d) => d.letter));
      y.domain([0, d3.max(data, (d) => d.frequency)]);

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).ticks(10, '%'))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');

      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.letter))
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        // everything after this is with regard to the transition
        .transition()
        .duration(500)
        .attr('y', (d) => y(d.frequency))
        .attr('height', (d) => height - y(d.frequency));
    });
  }
}
