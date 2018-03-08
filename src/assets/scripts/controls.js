import * as d3 from 'd3';

export default class Controls {
  constructor(vars) {
    this.active = vars
    this.groupByValues = ['functional_area', 'location', 'business_unit'];
    this.groupByLevels = [1, 2, 3];
    this.div = d3.select('div.controls');
    this.controls = {};

    this.renderToggle('groupBy', this.groupByValues);
    this.renderToggle('groupByLevel', this.groupByLevels);
  }

  renderToggle(cls, data) {
    let toggles = this.div.selectAll(`.${cls}`).selectAll('.toggle')
      .data(data);
    const newToggles = toggles.enter().append('div')
      .attr('class', 'toggle capitalize');
    toggles = toggles.merge(newToggles).text((d) => this.beautify(d))
      .classed('active', (d) => d === this.active[cls]);
    
    // register control
    this.controls[cls] = toggles;
  }

  beautify(val) {
    return typeof val === 'string' ? val.replace('_', ' ') : val;
  }
}
