(function () {

    angular
        .module('mapperApp.journeyService', [])
        .service('journeyService', journeyService);

    journeyService.$inject = ['$http', '$window', 'ajax', 'authentication'];

    function journeyService($http, $window, ajax, authentication) {

        var getUsersJourneys = function () {
            return ajax.get('/api/journeys', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var deleteJourney = function (journeyID) {
            return ajax.delete('/api/journeys', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authentication.getToken()
                },
                params: {
                    journeyID: journeyID
                }
            });
        };

        return {
            getUsersJourneys: getUsersJourneys,
            deleteJourney: deleteJourney
        };
    }

})();