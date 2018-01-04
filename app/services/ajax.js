angular.module('mapperApp.ajax', [])
	.service('ajax', function ($http, $q) {
		this.post = function (url, data) {
			var def = $q.defer();

			var config = {
				headers: {
					'Content-Type': 'application/json'
				}
			};
			$http.post(url, data, config).then(
				function (data) {
					def.resolve(data);
				},
				function (error) {
					def.reject(error);
				});
			return def.promise;
		};

		this.get = function (url, data, newConfig) {
			var def = $q.defer();
			var config;

			if (newConfig) {
				//Use passed in headers
				config = newConfig;

			} else {
				//Use default headers
				config = {
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}

			$http.get(url, data, config).then(
				function (data) {
					def.resolve(data);
				},
				function (error) {
					def.reject(error);
				});
			return def.promise;
		};

		this.put = function (url, data) {
			var def = $q.defer();

			var config = {
				headers: {
					'Content-Type': 'application/json'
				}
			};
			$http.put(url, data, config).then(
				function (data) {
					def.resolve(data);
				},
				function (error) {
					def.reject(error);
				});
			return def.promise;
		};

		this.delete = function (url, data, newConfig) {
			var def = $q.defer();
			var config;

			if (newConfig) {
				//Use passed in headers
				config = newConfig;

			} else {
				//Use default headers
				config = {
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}

			$http.delete(url, data, config).then(
				function (data) {
					def.resolve(data);
				},
				function (error) {
					def.reject(error);
				});
			return def.promise;
		};
		return this;
	});