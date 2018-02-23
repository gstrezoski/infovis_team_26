import * as d3 from 'd3';

export default class BarChart {

  // Accept external data to make it reusable
  constructor(data) {
    this.data = data;
    this.render();

    window.addEventListener('resize', this.render);
  }

  render() {
    const svg = d3.select('svg.bar-chart'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      box = svg.node().getBoundingClientRect();
    
    let width, height;
    // Maybe the DOM hasn't loaded correctly. Then the graph will be the wrong size
    if (box.height === 150 && box.width === 300) {
      width = (window.innerWidth / 2) - box['left'] - margin.left - margin.right;
      height = (window.innerHeight / 2) - box['top'] - margin.top - margin.bottom;
    } else {
      width = box['width'] - margin.left - margin.right;
      height = box['height'] - margin.top - margin.bottom;
    }

    const x = d3.scaleBand().rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear()
        .rangeRound([height, 0]);

    svg.selectAll('g').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    d3.tsv(this.data, (d) => {
      d.frequency = +d.frequency;
      return d;
    }, (error, data) => {
      if (error) { throw error; }

      x.domain(data.map((d) => d.letter));
      y.domain([0, d3.max(data, (d) => d.frequency)]);

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height})`)
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
