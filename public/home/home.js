angular.module('mapperApp.home', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('mapperApp.home', {
                name: 'home',
                url: '/home', //defines where this controller is hit, its route, can be /home for example
                controller: 'homeCtrl', //points to our controller
                templateUrl: 'home/home.view.html'
            })
            .state('mapperApp.onload', {
                name: 'onload',
                url: '', //defines where this controller is hit, its route, can be /home for example
                controller: 'homeCtrl', //points to our controller
                templateUrl: 'home/home.view.html'
            });
    })
    .controller('homeCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        console.log('Hit the Home Controller!');

        $rootScope.$emit('event', 'Home');
    }]);