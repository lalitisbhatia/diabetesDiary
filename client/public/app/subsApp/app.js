'use strict';

var subsApp = angular.module('subsApp', ['commonApp','pageslide-directive','ui.router','ngRoute']);
subsApp.config(['$stateProvider','$routeProvider',function($stateProvider,$routeProvider){
    //$routeProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: '../partials/subs/diabetes/insulinCalc.jade'
        })

        // Feeling Full route and sub routes
        .state('diary', {
          url: '/diary',
          templateUrl: '../partials/subs/diabetes/insulinDiary.jade'
        })
        .state('home.full.food', {
          url: 'food/:date',
          templateUrl: '../partials/subs/diary/foodEntry.jade'
        })
        .state('home.full.activity', {
          url: 'activity/:date',
          templateUrl: '../partials/subs/diary/activityEntry.jade'
        })
        .state('home.full.other', {
          url: 'other/:date',
          templateUrl: '../partials/subs/diary/addMore.jade'
        })


        // profile views
        .state('profile', {
            url: '/profile',
            templateUrl: '../partials/subs/profile/profile.jade'
        })
        .state('profile.pers', {
          url: '/pers',
          templateUrl: '../partials/subs/profile/profileForm.jade'
        })
        .state('profile.assm', {
          url: '/assm',
          templateUrl: '../partials/subs/profile/profileAssm.jade'
        })
        .state('profile.other', {
          url: '/other',
          templateUrl: '../partials/subs/profile/profileOther.jade'
        })


        .state('diabetes', {
          url: '/diabetes',
          templateUrl: '../partials/subs/diabetes/insulinCalc.jade'
        })
        .state('social', {
            url: '/social',
            templateUrl: '../partials/subs/social/social.jade'
        })

        .state('reset', {
            url: '/reset/:token',
            templateUrl: '../partials/reset.jade'
        })
}]);
subsApp.run(['$state', function ($state) {
    $state.transitionTo('home');
}]);

