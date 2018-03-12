import * as d3 from 'd3';

export default class LineChart {

  // Accept external data to make it reusable
  constructor() {
    this.selector = 'gender';
    this.svg = d3.select('svg.line-chart');
    this.container = this.svg.append('g').classed('container', true);
    this.dateParse = d3.timeParse('%d-%m-%Y');

    window.addEventListener('resize', () => { this.size(); });

    this.size();
  }

  setSelector(newValue) {
    this.selector = newValue;
    this.render();
  }

  load(url) {
    this._loading = true;
    d3.csv(url, (d) => {
      Object.keys(d).forEach((key) => {
        d[key] = key === 'month' ? this.dateParse(d[key]) : +d[key];
      });
      return d;
    }, (error, data) => {
      if (error) { throw error; }

      this.data = data.sort((a, b) => a.month > b.month);
      this._loading = false;
      this.render();
    });
  }

  size() {
    const box = this.svg.node().getBoundingClientRect();
    
    // Maybe the DOM hasn't loaded correctly. Then the graph will be the wrong size
    if (box.height === 150 && box.width === 300) {
      setTimeout(() => this.size(), 100);
    } else {
      this.width = box['width'] - 40;
      this.height = box['height'] - 40;
      this.render();
    }
  }

  render() {
    if (this._loading !== false || !this.height) { return; }

    let parseTime = d3.timeParse('%d-%m-%Y');
    const x = d3.scaleTime().range([20, this.width]),
      y = d3.scaleLinear().range([this.height, 0]);

    x.domain(d3.extent(this.data, (d) => d.month));
    y.domain([0, d3.max(this.data, (d) => {
      let max = 0;
      Object.values(d).forEach((v) => {
        //console.log(max, v);
        if (typeof v === 'number') { max =  Math.max(v, max); }
      })
      return max;
    })]);

    this.container.selectAll('.axis').remove();
    this.container.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x));

    this.container.append('g')
      .attr('transform', 'translate(20, 0)')
      .attr('class', 'axis')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');
    
    const departments = this.data.columns.slice(1);
    this.container.selectAll('.line').remove();
    departments.forEach((department, i) => {
      let line = d3.line()
        .x((d) => x(d.month))
        .y((d) => y(d[department])
        );
      
      this.container.append('path')
        .data([this.data])
        .attr('class', 'line') 
        .attr('d', (d) => {
          console.log(d, line(d));
          return line(d);
        })
        .attr('stroke', (d) => d3.interpolateWarm(i / departments.length));
    })
    // everything after this is with regard to the transition
    /*.transition()
      .duration(500)
      .attr('y', (d) => y(d.frequency))
      .attr('height', (d) => height - y(d.frequency))*/
  }
}
