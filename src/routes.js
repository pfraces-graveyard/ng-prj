angular.module('routes', ['ui.router'])
.config(function ($urlRouterProvider, $stateProvider) {
  	'use strict';

  	$urlRouterProvider.otherwise('/home');

  	$stateProvider
  	.state('root', {
  		abstract: true,
    	templateUrl: 'views/root.html'
  	})
  	.state('home', {
  		parent: 'root',
  		url: '/home',
  		templateUrl: 'views/home.html'
  	});
});