angular.module('mapperApp.login', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('mapperApp.login', {
        name: 'login',
        url: '/login', //defines where this controller is hit, its route, can be /home for example
        controller: 'loginCtrl', //points to our controller
        templateUrl: 'login/login.view.html'
      });
  })
  .controller('loginCtrl', ['$scope', '$rootScope', '$location', 'authentication', '$window', function ($scope, $rootScope, $location, authentication, $window) {
    console.log('Hit Login Controller!');

    $scope.logUserIn = function () {

      var user = {
        email: $scope.email,
        password: $scope.password
      };

      authentication
        .login(user)
        .then(function () {
          $location.path('/home');
          $window.location.reload();
        })
        .catch(function(error) {
          console.log(error.data);
          $scope.error = error.data.message;
        });
    };

    console.log($scope.loginUser);

    $rootScope.$emit('event', 'Login');
  }]);