// Import dependent classes
import BarChart from '_scripts/barchart.js';
import TreeChart from '_scripts/tree.js';

// Import data
import barchart_data from '_data/barchart-data.tsv';
import core_2015_01 from '_data/core_2015-01.csv';

// Initialize classes and assign their instances to variables.
// This way, we can make them interact.
const bar = new BarChart(barchart_data);

const tree = new TreeChart(core_2015_01);
