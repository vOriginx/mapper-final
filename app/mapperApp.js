var app = angular.module('mapperApp', [
        //inject other child controller dependencies
        'ui.router',
        'ui.materialize',
        'ngMessages',
        'mapperApp.home',
        'mapperApp.journeys',
        'mapperApp.journeyDetails',
        'mapperApp.newjourney',
        'mapperApp.login',
        'mapperApp.register',
        'mapperApp.authentication',
        'mapperApp.mapsService',
        'mapperApp.journeyService',
        'mapperApp.ajax',
        'ngDomEvents'
    ])
    .config(function ($stateProvider, $locationProvider) {
        $stateProvider.state('mapperApp', {
            url: '', //defines where this controller is hit, its route, can be /home for example
            abstract: true, //this is our main controller, so its abstract and you can reference the variables resolved from this controller in child controllers
            controller: 'mapperAppCtrl' //points to our controller
        });
        $locationProvider.hashPrefix('');
        // $locationProvider.html5Mode(true);
    })
    .controller('mapperAppCtrl', ['$scope', '$rootScope', 'authentication', '$window', function ($scope, $rootScope, authentication, $window) {
        console.log('Hit the Main Controller!');

        $scope.isUserLoggedIn = authentication.isLoggedIn();

        $rootScope.$on('event', function (data, title) {
            $rootScope.title = title;
        });

        $scope.logout = function logout() {
            authentication.logout();
            $window.location.reload();
        };
    }])
    .run(['$rootScope', '$location', 'authentication', '$transitions', run]);



function run($transitions, $location, authentication) {
    //TODO: protect the /journeys route so only authenticated users can access
    
    // $transitions.onBefore({}, function(transition) {
    //     // check if the state should be protected
    //     if (!authentication.isLoggedIn()) {
    //       // redirect to the 'login' state
    //       return transition.router.stateService.target('login');
    //     }
    //   });
}