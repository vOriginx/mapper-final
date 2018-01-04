angular.module('mapperApp.journeyDetails', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('mapperApp.journeyDetails', {
                name: 'journeyDetails',
                url: '/journeyDetails/:journeyID', //defines where this controller is hit, its route, can be /home for example
                controller: 'journeyDetailsCtrl', //points to our controller
                templateUrl: 'journeyDetails/journeyDetails.view.html'
            });
    })
    .controller('journeyDetailsCtrl', ['$scope', '$rootScope', 'authentication', 'journeyService', 'mapsService', '$location', '$stateParams',
        function ($scope, $rootScope, authentication, journeyService, mapsService, $location, $stateParams) {
            console.log('Hit Journeys Controller!');
            $rootScope.$emit('event', 'Journey Details');
            var journeyID = $stateParams.journeyID;
            $scope.user = authentication.currentUser();

            try {
                //Create map
                $scope.map = mapsService.createMap();

                //Call ajax service to return promise
                journeyService.getUsersJourneys().then(function (result) {
                    var routes = result.data;
                    $scope.findMyRoute(routes);
                });

            } catch (error) {

                console.log(error);
                $scope.error = 'Error processing request.';

            }

            $scope.deleteJourney = function () {
                journeyService
                    .deleteJourney(journeyID)
                    .then(function () {
                        console.log('Done');
                        $location.path('/journeys');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            };

            $scope.findMyRoute = function (routes) {
                var myRoute;

                // console.log(routes);
                for (var i = 0; i < routes.length; i++) {
                    if (routes[i]._id === journeyID) {
                        myRoute = routes[i];
                        break;
                    }
                }

                $scope.routeName = myRoute.name;

                initDirections(myRoute);

                // console.log(myRoute);

            };

            function initDirections(myRoute) {
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;

                directionsDisplay.setMap($scope.map);

                //Get start and end coordinates
                var start = {
                    lat: parseFloat(myRoute.coords[0].lat),
                    lng: parseFloat(myRoute.coords[0].lng)
                };

                var dest = {
                    lat: parseFloat(myRoute.coords.slice(-1)[0].lat),
                    lng: parseFloat(myRoute.coords.slice(-1)[0].lng)
                };
                // var dest = new google.maps.LatLng(myRoute.coords.slice(-1)[0].lat, myRoute.coords.slice(-1)[0].lng);
                // var dest = myRoute.coords.slice(-1)[0];
                var waypoints = [];

                //If route has more than 2 points populate waypoints array
                if (myRoute.coords.length > 2) {
                    for (var i = 1; i < myRoute.coords.length - 1; i++) {
                        waypoints.push({
                            location: {
                                lat: parseFloat(myRoute.coords[i].lat),
                                lng: parseFloat(myRoute.coords[i].lng)
                            },
                            stopover: true
                        });
                    }
                }

                //DEBUGGING: 
                // console.log('Start coords: ');
                // console.log(start);
                // console.log('Waypoints: ');
                // console.log(waypoints);
                // console.log('End coords: ');
                // console.log(dest);

                //Draw directions on map and display information
                directionsService.route({
                    origin: start,
                    destination: dest,
                    waypoints: waypoints,
                    // optimizeWaypoints: true,
                    travelMode: 'DRIVING',
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                    drivingOptions: {
                        departureTime: new Date(Date.now()), // for the time N milliseconds from now.
                        trafficModel: 'optimistic'
                    }
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                        var route = response.routes[0];
                        var summaryPanel = document.getElementById('summaryPanel');
                        summaryPanel.innerHTML = '';
                        // For each route, display summary information.
                        for (var i = 0; i < route.legs.length; i++) {
                            var routeSegment = i + 1;
                            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                                '</b><br>';
                            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                            summaryPanel.innerHTML += 'Distance: ' + route.legs[i].distance.text + '<br>';
                            summaryPanel.innerHTML += 'Estimate travel time: ' + route.legs[i].duration.text + '<br><br>';
                        }

                        // logRouteInfo(route);

                    } else {
                        $scope.error = 'Error processing request, please try again later.';
                    }
                });
            }

            function logRouteInfo(route) {
                console.log(route);
            }

            //Generate estimated travel time and display

        }
    ]);