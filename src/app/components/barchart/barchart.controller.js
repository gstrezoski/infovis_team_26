'use strict';

import * as d3 from 'd3';

import barchart_data from '_data/barchart-data.tsv';

export default class BarchartController {
  constructor() {
    'ngInject';
  }

  $onInit() {
    const svg = d3.select('svg.bar-chart'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear()
        .rangeRound([height, 0]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.tsv('assets/data/barchart-data.tsv', (d) => {
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
        .attr('y', (d) => y(d.frequency))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y(d.frequency));
    });
  }
}
