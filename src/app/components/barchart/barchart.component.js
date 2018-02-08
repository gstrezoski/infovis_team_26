'use strict';

import barchartTpl from './barchart.html';
import BarchartController from './barchart.controller';

export default class BarchartComponent {
  constructor() {
    this.templateUrl = barchartTpl;
    this.controller = BarchartController;
  }
}
