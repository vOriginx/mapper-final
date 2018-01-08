angular.module('mapperApp.register', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('mapperApp.register', {
                name: 'register',
                url: '/register', //defines where this controller is hit, its route, can be /home for example
                controller: 'registerCtrl', //points to our controller
                templateUrl: 'register/register.view.html'
            });
    })
    .controller('registerCtrl', ['$scope', '$rootScope', '$location', 'authentication', '$window', function ($scope, $rootScope, $location, authentication, $window) {
        $rootScope.$emit('event', 'Register');

        console.log('Hit Register Controller!');

        // console.log($scope.first_name);

        $scope.registerUser = function () {
            var user = {
                first_name: $scope.first_name,
                last_name: $scope.last_name,
                email: $scope.email,
                password: $scope.password
            };

            console.log('Submitting register request');

            authentication
                .register(user)
                .then(function () {
                    $location.path('/journeys');
                    $window.location.reload();
                })
                .catch(function (error) {
                    if (error) {
                        $scope.error = error.data;
                    }
                });
        };
    }]);