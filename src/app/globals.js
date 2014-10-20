/**
 * globals module
 * --------------
 *
 * Exposes 3rd party non angular libraries (such as lodash) as
 * angular services to be available to the angular's DI system
 *
 * ```js
 * angular.module('app.controllers', [
 *     'app.globals'
 * ])
 * 
 * .controller('home', function (_, $scope) {
 *     $scope.list = _.range(10);
 * });
 * ```
 */

angular.module('app.globals', [])

/**
 * lodash
 * ------
 *
 * A utility library delivering consistency, customization, performance
 * and extras
 *
 * A drop-in replacement for underscore
 *
 * underscore
 * ----------
 *
 * A JavaScript library that provides a whole mess of useful functional
 * programming helpers
 *
 * Underscore provides over 100 functions that support both your favorite
 * workaday functional helpers: map, filter, invoke — as well as more
 * specialized goodies: function binding, javascript templating, creating
 * quick indexes, deep equality testing, and so on
 */

.factory('_', function($window) {
    'use strict';

    return $window._;
});
