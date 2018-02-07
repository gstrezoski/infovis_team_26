'use strict';



import moment from 'moment';

import angularLogo from '_images/angular.png';

export default class MainController {
    constructor($log) {
        'ngInject';
        this.$log = $log;
    }

    $onInit() {
        
        
        this.moment_version = moment.version;
        
        this.angularLogo = angularLogo;
    }
}