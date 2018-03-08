import * as d3 from 'd3';
import Hull from '_scripts/hull.js';

export default class TreeChart {

  constructor(vars) {
    this.vars = vars;
    this.svg = d3.select('svg.tree');

    this.treelayer = this.svg.append('g').attr('class', 'treelayer');
    this.hulllayer = this.svg.append('g').attr('class', 'hulllayer');
    this.uilayer = this.svg.append('g').attr('class', 'uilayer');
    this.stratify = d3.stratify().parentId((d) => d.solid_line);

    this.tree = d3.tree().separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    this.size();

    window.addEventListener('resize', () => { this.size(); });
  }

  setVar(key, val) {
    this.vars[key] = val;
    this.render();
  }

  size() {
    const box = this.svg.node().getBoundingClientRect(),
      oldValues = [this.width, this.height];
    
    // Maybe the DOM hasn't loaded correctly. Then the graph will be the wrong size
    if (box.height === 150 && box.width === 300) {
      // Retry
      setTimeout(() => this.size(), 100);
    } else {
      this.width = box['width'];
      this.height = box['height'];

      // Divide by 2.2 instead of 2 to have some padding at all sides
      this.tree.size([2 * Math.PI, Math.min(this.width, this.height) / 2.2]);

      if (oldValues[0] !== this.width && oldValues[1] !== this.height) {
        if (this._rendered) {
          this.resize()
        } else {
          this.render();
        }
      }
      return this;
    }
  }

  load(src) {
    this._loading = true;
    d3.text(src, (error, raw) => {
      if (error) { throw error; }
      this.data = d3.dsvFormat(';').parse(raw)
        .map((d) => ({
          id: +d.job_id,
          solid_line: +d.solid_line || '',
          name: `${d.first_name} ${d.last_name}`,
          gender: d.gender,

          location_level1: d.location_level1,
          location_level2: d.location_level2,
          location_level3: d.location_level3,

          business_unit_level1: d.business_unit_level1,
          business_unit_level2: d.business_unit_level2,
          business_unit_level3: d.business_unit_level3,

          functional_area_level1: d.functional_area_level1,
          functional_area_level2: d.functional_area_level2,
          functional_area_level3: d.functional_area_level3,
        }));
      this._loading = false;
      this.render();
    });
    return this;
  }

  render() {
    if (this._loading !== false) { return; }
    if (!this.height) { return }
    this.root = this.tree(this.stratify(this.data).sort((a, b) => this.sort(a, b)));

    this.links = this.treelayer.selectAll('.link').data(this.root.links());
    this.links.exit().remove();
    const newLinks = this.links.enter().append('path')
      .classed('link', 'true');
    this.links = this.links.merge(newLinks);

    this.nodes = this.treelayer.selectAll('.node').data(this.root.descendants());
    this.nodes.exit().remove();
    const newNodes = this.nodes.enter().append('g');
    this.nodes = this.nodes.merge(newNodes)
      .attr('class', (d) => d.children ? 'node node-interal' : 'node node-leaf');
      
    this.nodes.append('circle')
      .attr('r', (d) => 2 + this.root.height - d.depth)
      .attr('class', (d) => d.data.gender);

    this.group();
    this._rendered = true;
    this.resize();
  }

  resize() {
    this.links
      .transition()
      .duration(1500)
      .attr('d', d3.linkRadial().angle((d) => d.x)
        .radius((d) => d.y));
    this.nodes
      .transition()
      .duration(1500)
      .attr('transform', (d) => `translate(${this.locate(d)})`);
    this.hulls
      .transition()
      .delay(1500)
      .attr('d', (d) => d.d);
  }

  locate(d) {
    const x = d.x - Math.PI / 2;
    return [d.y * Math.cos(x), d.y * Math.sin(x)];
  }

  sort(a, b) {
    const av = a.data[`${this.vars.groupBy}_level${this.vars.groupByLevel}`],
      bv = b.data[`${this.vars.groupBy}_level${this.vars.groupByLevel}`];
    return av.localeCompare(bv);
  }

  getFirstDifferentManager(d) {
    let p = d.parent;
    if (p && this.sort(p, d) === 0) {
      return this.getFirstDifferentManager(p);
    }
    return p ? p.data.name : d.data.name;
  }

  group() {
    const groups = d3.nest()
      .key((d) => d.data[`${this.vars.groupBy}_level${this.vars.groupByLevel}`])
      .key((d) => this.getFirstDifferentManager(d))
      .entries(this.root.descendants());
    
    this.hullKeys = this.shuffle(groups.map((g) => g.key));
    this.hullObjs = [];
    groups.forEach((g) => {
      Object.values(g.values).forEach((v) => {
        this.hullObjs.push(new Hull(g.key, v.values.map((e) => this.locate(e))));
      });
    });

    this.hulls = this.hulllayer.selectAll('.hull').data(this.hullObjs);
    this.hulls.exit().remove();
    const newHulls = this.hulls.enter().append('path')
      .classed('hull', true);
    this.hulls = this.hulls.merge(newHulls).attr('d', (d) => d.d)
      .attr('fill', (d) => d3.interpolateWarm(this.hullKeys.indexOf(d.id) / this.hullKeys.length));
    
    this.drawLegend();
  }

  shuffle(a, seed=1) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(this.random(seed) * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  random(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  drawLegend() {
    this.legend = this.uilayer.selectAll('.legend').data(this.hullKeys);
    this.legend.exit().remove();
    const newLegend = this.legend.enter().append('g');
    
    // The maximum number of elements to have on the first column
    const limit = Math.floor((this.height - 30) / 20);
    this.legend = this.legend.merge(newLegend).attr('transform', (d, i) => `translate(${i < limit ? 0 : this.width - 40}, ${i % limit * 20})`)
      .attr('class', (d, i) => `legend ${i < limit ? 'left' : 'right'}`);
    this.legend.selectAll('*').remove();
    this.legend.append('rect')
      .attr('x', 20)
      .attr('y', 20)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d) => d3.interpolateWarm(this.hullKeys.indexOf(d) / this.hullKeys.length));
    
    // Numbers found through trial and error
    this.legend.append('text')
      .attr('x', (d, i) => i < limit ? 42 : 14)
      .attr('y', 33)
      .text((d) => d || 'Unspecified');
  }
}
