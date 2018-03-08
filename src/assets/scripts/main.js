// Import dependent classes
// import BarChart from '_scripts/barchart.js';
import TreeChart from '_scripts/tree.js';
import Controls from '_scripts/controls.js';

// Import data
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
