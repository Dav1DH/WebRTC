'use strict';

/**
 * @ngdoc overview
 * @name webRtcApp
 * @description
 * # webRtcApp
 *
 * Main module of the application.
 */
angular
  .module('webRtcApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/videochat/', {
        templateUrl: 'views/videochat.html',
        controller: 'VideoChatCtrl'
      })
      .when('/videochat/:id', {
        templateUrl: 'views/videochat.html',
        controller: 'VideoChatCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.hashPrefix('');
  });
