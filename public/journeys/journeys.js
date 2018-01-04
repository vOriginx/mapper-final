angular.module('mapperApp.journeys', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('mapperApp.journeys', {
                name: 'journeys',
                url: '/journeys', //defines where this controller is hit, its route, can be /home for example
                controller: 'journeysCtrl', //points to our controller
                templateUrl: 'journeys/journeys.view.html'
            });
    })
    .controller('journeysCtrl', ['$scope', '$rootScope', 'authentication', 'journeyService', '$location', function ($scope, $rootScope, authentication, journeyService, $location) {
        console.log('Hit Journeys Controller!');
        $rootScope.$emit('event', 'Journeys');

        $scope.user = authentication.currentUser();

        try {

            //Call ajax service to return promise
            var routePromise = journeyService.getUsersJourneys();

            //resolve data from promise to use in view
            routePromise.then(function(result) {
                $scope.routes = result.data;
            });

        } catch (error) {

            console.log(error);
            $scope.error = 'Error processing request.';

        }

        console.log($scope.routes);

    }]);