'use strict';

import footerModule from './components/footer/footer.module';
import barchartModule from './components/barchart/barchart.module';

export default angular.module('index.components', [
  footerModule.name,
  barchartModule.name,
]);
