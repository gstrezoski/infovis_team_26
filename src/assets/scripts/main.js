// Import dependent classes
// import BarChart from '_scripts/barchart.js';
import TreeChart from '_scripts/tree.js';
import Controls from '_scripts/controls.js';

// Import data
import LineChart from '_scripts/linechart.js';

// Import data
import barchart_data from '_data/barchart-data.tsv';
import line_chart_location_data from '_data/line_chart_location.csv';
import core_2015_01 from '_data/core_2015-01.csv';

// Default variables
const defaultVars = {
  groupBy: 'functional_area',
  groupByLevel: 1,
}

// Initialize classes and assign their instances to variables.
// This way, we can make them interact.
const ctrl = new Controls(defaultVars);

const tree = new TreeChart(defaultVars).load(core_2015_01);

['groupBy', 'groupByLevel'].forEach((cls) => {
  ctrl.controls[cls].on('click', (d) => {
    ctrl.active[cls] = d;
    ctrl.controls[cls].classed('active', (d) => d === ctrl.active[cls]);
    tree.setVar(cls, d);
  });
});
//const bar = new BarChart(barchart_data);
const line = new LineChart().load(line_chart_location_data);
//const tree = new TreeChart(core_2015_01);
