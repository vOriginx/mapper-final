(function () {

    angular
        .module('mapperApp.authentication', [])
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window', 'ajax'];

    function authentication($http, $window, ajax) {

        var saveToken = function (token) {
            $window.localStorage['mapper-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['mapper-token'];
        };

        var isLoggedIn = function () {
            var token = getToken();
            var payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                //check token is in date, return true/false
                return payload.exp > Date.now() / 1000;
            } else {
                //return false if token does not exist
                return false;
            }
        };

        var currentUser = function () {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    _id: payload._id,
                    email: payload.email,
                    first_name: payload.first_name,
                    last_name: payload.last_name                                        
                };
            }
        };

        var register = function (user) {
            return ajax.post('/api/register', user).then(function(result) {
                saveToken(result.data.token);
            });
        };

        var login = function (user) {
            return $http.post('/api/login', user).then(function(result) {
                saveToken(result.data.token);
            });
        };

        var logout = function () {
            $window.localStorage.removeItem('mapper-token');
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            register: register,
            login: login,
            logout: logout
        };
    }

})();