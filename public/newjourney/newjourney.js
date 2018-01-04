angular.module('mapperApp.newjourney', ['ui.router', 'ngDomEvents'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('mapperApp.newjourney', {
                name: 'newjourney',
                url: '/newjourney', //defines where this controller is hit, its route, can be /home for example
                controller: 'newjourneyCtrl', //points to our controller
                templateUrl: 'newjourney/newjourney.view.html'
            });
    })
    .controller('newjourneyCtrl', ['$scope', '$rootScope', 'authentication', '$location', 'mapsService', function ($scope, $rootScope, authentication, $location, mapsService) {
        console.log('Hit New Journey Controller!');
        var coords = [];

        $scope.user = authentication.currentUser();

        //Set Title
        $rootScope.$emit('event', 'New Journey');

        //Create map
        $scope.map = mapsService.createMap();

        //Handle waypoints inputs
        $scope.waypoints = [{
                id: 'waypoint1'
            },
            {
                id: 'waypoint2'
            }
        ];

        $scope.addNewWaypoint = function () {

            if ($scope.waypoints.length === 5) {
                alert('Only 5 waypoints are allowed!');
                return;
            }
            var newWaypointID = $scope.waypoints.length + 1;
            $scope.waypoints.push({
                'id': 'waypoint' + newWaypointID
            });

            angular.element(document).ready(function () {
                enableAutocomplete();
            });
        };

        $scope.removeWaypoint = function () {
            if ($scope.waypoints.length === 2) {
                alert('You must leave at least 2 waypoints!');
                return;
            }
            var lastWaypoint = $scope.waypoints.length - 1;
            $scope.waypoints.splice(lastWaypoint);
        };

        // if client allows HTML5 Geolocation
        // create marker on map with current location
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function (position) {
        //         var pos = {
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude
        //         };

        //         $scope.map.setCenter(pos);

        //     });
        // } else {
        //     alert('Browser does not support Geolocation');
        // }

        //Activate autocomplete for inputs when DOM is loaded
        angular.element(document).ready(function () {
            enableAutocomplete();
        });

        function enableAutocomplete () {
            var inputs = document.getElementsByClassName('waypoint');

            var autocompletes = [];

            // Restrict autocomplete fields to UK locations
            var options = {
                componentRestrictions: {
                    country: 'uk'
                }
            };

            // Loop through all waypoints, add event listener to autocomplete
            // whenever autocomplete is selected, draw marker on map
            for (var i = 0; i < inputs.length; i++) {
                var autocomplete = new google.maps.places.Autocomplete(inputs[i], options);
                autocomplete.inputId = inputs[i].id;
                // Pass i to function, to display stop no in infowindow
                autocomplete.addListener('place_changed', addMarkerToMap);
                autocompletes.push(autocomplete);
            }
        }

        function addMarkerToMap() {
            //Stops function being executed when user uses 'enter' key on autocomplete field
            var input = document.getElementById(this.inputId);
            google.maps.event.addDomListener(input, 'keydown', function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                }
            });

            var place = this.getPlace();
            var placeId = place.place_id;
            var service = new google.maps.places.PlacesService($scope.map);
            var infowindow = new google.maps.InfoWindow();
            var latLng = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            
            coords.push({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });

            service.getDetails({
                'placeId': placeId
            }, function (place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: place.geometry.location,
                        draggable: false,
                        animation: google.maps.Animation.DROP
                    });

                    //Display info windows on each waypoint added
                    infowindow.setContent(place.name);
                    infowindow.open($scope.map, marker);
                }
            });
        }

        //gather geocoded co-ordinates from inputs into an array, 
        //call mapsService.saveJourney(coords, authentication.currentUser.email);
        // console.log($scope.user.email, locations);

        $scope.saveRoute = function () {
            console.log('Hit saveJourney function');

            var routeName = document.getElementById('routeName').value;

            if (coords.length >= 2) {
                $scope.error = '';
                console.log('Saving journey');

                //Construct route object using routeName + coords
                var route = {
                    name: routeName,
                    coords: coords,
                    email: $scope.user.email
                };

                console.log(route);

                mapsService
                    .saveJourney(route)
                    .then(function () {
                        $location.path('/journeys');
                    })
                    .catch(function (error) {
                        console.log(error);
                        $scope.error = 'Error processing request, please try again later.';
                    });
            } else {
                $scope.error = 'Not enough waypoints selected!';
            }

            // var coords = [];
            // var address = '';
            // var inputs = document.getElementsByClassName('waypoint');
            // var routeName = document.getElementById('routeName').value;
            // var geocoder = new google.maps.Geocoder();

            // for (var i = 0; i < inputs.length; i++) {
            //     address = inputs[i].value.toString();
            //     //geocode each input and populate locations[]
            //     if (address) {

            //         geocoder.geocode({
            //             'address': address
            //         }, function (results, status) {
            //             if (status === google.maps.GeocoderStatus.OK) {
            //                 coords.push({
            //                     lat: results[0].geometry.location.lat(),
            //                     lng: results[0].geometry.location.lng()
            //                 });
            //             } else {
            //                 alert('Invalid geocode request: ' + status + '. Perhaps use the suggested locations?');
            //             }
            //             if (coords.length === inputs.length) {
            //                 console.log('Saving journey');
            //                 mapsService
            //                     .saveJourney(routeName, coords, $scope.user.email)
            //                     .then(function () {
            //                         $location.path('/journeys');
            //                     })
            //                     .catch(function (error) {
            //                         console.log(error.data);
            //                         $scope.error = error.data.message;
            //                     });
            //             }
            //         });
            //     }
            // }

            // console.log($scope.user.email, routeName, coords);

            // if (coords.length >= 1) {

            // }

        };

    }]);