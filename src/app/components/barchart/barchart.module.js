'use strict';

import BarchartComponent from './barchart.component';
import './barchart.scss';

const barchartModule = angular.module('barchart-module', []);

barchartModule
  .component('barChart', new BarchartComponent());

export default barchartModule;
