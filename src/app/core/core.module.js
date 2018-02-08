'use strict';

const shared = angular.module('core.shared', []);

import validationTestDirective from './directives/validation-test/validation-test.directive';

import constants from './services/constants';
import storeFactory from './services/store.factory';

validationTestDirective(shared);

constants(shared);
storeFactory(shared);

export default shared;
