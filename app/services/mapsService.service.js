(function () {

    angular
        .module('mapperApp.mapsService', [])
        .service('mapsService', mapsService);

    mapsService.$inject = ['$http', '$window', 'ajax'];

    function mapsService($http, $window, ajax) {

        var createMap = function () {
            var mapOptions = {
                zoom: 5,
                //Default center = somewhere in Plymouth
                center: new google.maps.LatLng(55.3781, -3.4360),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var service = new google.maps.places.PlacesService(map);

            return map;
        };

        var saveJourney = function (route) {
            return ajax.post('/api/journeys', route);
        };

        return {
            createMap: createMap,
            saveJourney: saveJourney
        };
    }

})();