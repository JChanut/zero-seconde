require.config({
    paths: {
        jquery: '../js/jquery-1.9.1.min.js',
        angular: '../js/angular.min.js',
        ngTable: '../../dist'
    },
    shim: {
        'angular': {'exports': 'angular'}
    }
});

require([
    'jquery',
    'angular',
    'app'
], function ($, angular, app) {
    'use strict';

    angular.bootstrap(document, ['main']);
});
