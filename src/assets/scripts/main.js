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
  metric: 'gender',
}

// Set age range as a global variable
window.ranges = {
  age: [17, 70],
};

// Initialize classes and assign their instances to variables.
// This way, we can make them interact.
const ctrl = new Controls(defaultVars);

const tree = new TreeChart(defaultVars).load(core_2015_01);

const registerEvents = () => {
  // Check if everything has been rendered correctly
  if (!tree._rendered || !ctrl.controls) { setTimeout(registerEvents, 300); } else {
    ['groupBy', 'groupByLevel', 'metric'].forEach((cls) => {
      ctrl.controls[cls].on('click', (d) => {
        ctrl.active[cls] = d;
        ctrl.controls[cls].classed('active', (c) => c === ctrl.active[cls]);
        tree.setVar(cls, d);

        // After redrawing, reregister events
        registerEvents();
      });
    });

    tree.hulls.on('mouseenter', (d) => {
      // Add logic that should happen on start of hovering over a hull here
      tree.hulls.filter((hull) => d.id === hull.id).classed('hover', true);
      tree.legend.filter((leg) => d.id === leg).classed('hover', true);
    });

    tree.hulls.on('mouseleave', (d) => {
      // Add logic that should happen on end of hovering over a hull here
      tree.hulls.filter((hull) => d.id === hull.id).classed('hover', false);
      tree.legend.filter((leg) => d.id === leg).classed('hover', false);
    });

    tree.legend.on('mouseenter', (d) => {
      // Add logic that should happen on start of hovering over a legend here
      tree.hulls.filter((hull) => d === hull.id).classed('hover', true);
      tree.legend.filter((leg) => d === leg).classed('hover', false);
    });

    tree.legend.on('mouseleave', (d) => {
      // Add logic that should happen on end of hovering over a legend here
      tree.hulls.filter((hull) => d === hull.id).classed('hover', false);
      tree.legend.filter((leg) => d === leg).classed('hover', false);
    });
  }
}

registerEvents();
