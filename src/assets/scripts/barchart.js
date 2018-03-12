import * as d3 from 'd3';

export default class BarChart {

  // Accept external data to make it reusable
  constructor() {
    this.selector = 'gender';

    // window.addEventListener('resize', this.render);
  }

  setSelector(newValue) {
    this.selector = newValue;
    this.render();
  }

  load(url) {
    this._loading = true;
    d3.csv(this.data, (d) => {
      d.month = new Date(d.month)
      d.perc_women = +d.perc_women
      return d;
    }, (error, data) => {
      if (error) { throw error; }

      this.data = data;
      this._loading = false;
      this.render();
    });
  }

  render() {
<<<<<<< HEAD
    if(this._loading !== true) return;
=======
    const svg = d3.select(`svg#${this.id}`);

    let box = svg.node().getBoundingClientRect();
    console.log(box.height, box.width);

    if (box.height === 150 && box.width === 300) {
      // Retry
      console.log('retry.');
      setTimeout(() => this.render(), 100);
      return;
    }

    console.log('here!');

    svg.attr('width', box.width);
    svg.attr('height', box.height);
>>>>>>> d40e2b5... Add new feature: toggleable tooltip (homepage)

    const svg = d3.select('svg.bar-chart'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      box = svg.node().getBoundingClientRect();

    // console.log(`svg#${this.id}`);

    const x = d3.scaleTime().rangeRound([0, width])
        .padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

    let data = [];
    for (let i=0; i<7; i++) { data.push(Math.floor(Math.random() * 100)); }

    let g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain([1, 2, 3, 4, 5, 6, 7]);
    y.domain([0, d3.max(data, function(d) { return d; })]);

    x.domain(this.data.map((d) => d.month));
    y.domain([0, d3.max(data, (d) => d.perc_women)]);

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
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.month))
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      // everything after this is with regard to the transition
      .transition()
      .duration(500)
      .attr('y', (d) => y(d.perc_women))
      .attr('height', (d) => height - y(d.perc_women));
  }
}
