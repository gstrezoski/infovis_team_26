import * as d3 from 'd3';

export default class TreeChart {

  constructor(dataSrc) {
    this.dataSrc = dataSrc;

    this.svg = d3.select('svg.tree');

    this.treelayer = this.svg.append('g').attr('class', 'treelayer');
    this.stratify = d3.stratify().parentId((d) => d.solid_line);

    this.tree = d3.tree()
      .size([2 * Math.PI, 100])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    this.render();
    this.resize();

    window.addEventListener('resize', () => { this.resize(); });
  }

  resize() {
    const box = this.svg.node().getBoundingClientRect(),
      oldValues = [this.width, this.height];
    
    // Maybe the DOM hasn't loaded correctly. Then the graph will be the wrong size
    if (box.height === 150 && box.width === 300) {
      this.width = (window.innerWidth / 2) - box['left'];
      this.height = (window.innerHeight / 2) - box['top'];
    } else {
      this.width = box['width'];
      this.height = box['height'];
    }

    console.log(oldValues, this.width, this.height);

    if (oldValues[0] !== this.width && oldValues[1] !== this.height) {
      if (this._rendered) {
        this.relocate()
      } else {
        this.render();
      }
    }
  }

  render() {
    d3.text(this.dataSrc, (error, raw) => {
      if (error) { throw error; }
      const data = d3.dsvFormat(';').parse(raw)
        .map((d) => ({
          id: +d['job_id'],
          solid_line: +d['solid_line'] || '',
          name: `${d['first_name']} ${d['last_name']}`,
          gender: d['gender'],
        }));
      
      const root = this.tree(this.stratify(data).sort((a, b) => a.height - b.height || a.children - b.children));
      this.links = this.treelayer.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkRadial().angle(root.x)
          .radius(root.y));

      this.nodes = this.treelayer.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', (d) => d.children ? 'node node-interal' : 'node node-leaf');
      
      this.nodes.append('circle')
        .attr('r', (d) => 2 + root.height - d.depth)
        .attr('class', (d) => d.data.gender);

      this._rendered = true;
      this.relocate();
    });
  }

  relocate() {
    this.links
      .transition()
      .duration(500)
      .attr('d', d3.linkRadial().angle((d) => d.x)
        .radius((d) => d.y * this.height / 100));
    this.nodes
      .transition()
      .duration(500)
      .attr('transform', (d) => `translate(${this.locate(d)})`);
  }

  locate(d) {
    const y = +d.y * this.height / 100,
      x = +d.x - Math.PI / 2;
    
    return [y * Math.cos(x), y * Math.sin(x)];
  }
}
