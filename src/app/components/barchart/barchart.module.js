'use strict';

import BarchartComponent from './barchart.component';

const barchartModule = angular.module('footer-module', []);

barchartModule
  .component('barChart', new BarchartComponent());

export default barchartModule;
