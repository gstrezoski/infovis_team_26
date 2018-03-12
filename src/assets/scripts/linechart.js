import * as d3 from 'd3';

export default class LineChart {

  // Accept external data to make it reusable
  constructor() {
    this.selector = 'gender';
    this.svg = d3.select('svg.line-chart'),
    window.addEventListener('resize', this.render);

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
        d[key] = key === 'month' ? new Date(d[key]) : +d[key];
      });
      return d;
    }, (error, data) => {
      if (error) { throw error; }

      this.data = data;
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
      this.width = box['width'];
      this.height = box['height'];
      this.render();
    }
  }

  render() {
    if (this._loading !== false || !this.height) { return; }
    let parseTime = d3.timeParse('%d-%m-%Y');
    const x = d3.scaleTime().range([0, this.width]),
      y = d3.scaleLinear().range([this.height, 0]);
    

    x.domain(this.data.map((d) => d.month));
    y.domain([0, d3.max(this.data, (d) => {
      let max = 0;
      Object.values(d).forEach((v) => {
        //console.log(max, v);
        if (typeof v === 'number') { max =  Math.max(v, max); }
      })
      return max;
    })]);

    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height*0.8 + ')')
      .call(d3.axisBottom(x));

    this.svg.append('g')
      .attr('transform', 'translate(20, 5)')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');
    
    const departments = this.data.columns.slice(1);
    departments.forEach((department, i) => {
      let line = d3.line()
        .x((d) => x(d.month))
        .y((d) => y(d[department])
        );
      
      this.svg.append('path')
        .data([this.data])
        .attr('transform', 'translate(21, 0)')
        .attr('class', 'line') 
        .attr('d', line)
        .attr('stroke', (d) => d3.interpolateWarm(i / departments.length));
    })
    // everything after this is with regard to the transition
    /*.transition()
      .duration(500)
      .attr('y', (d) => y(d.frequency))
      .attr('height', (d) => height - y(d.frequency))*/
  }
}
