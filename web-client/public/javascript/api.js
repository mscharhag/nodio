var nodioClient = angular.module('nodioClient');

nodioClient.factory('api', ['$http', '$rootScope', function ($http, $rootScope) {

	var api = {};

	api.onNewPlayerStatus = 'onNewPlayerStatus';
	api.onRetrievedLocations = 'onRetrievedLocations';

	var url = 'http://192.168.1.8:3000'

	api.action = function(path) {
		$http.get(url + path).success(function(data, status, headers, config) {
			$rootScope.$emit(api.onNewPlayerStatus, {path: path}, data)
		}).error(function() {
			alert('error')
		})
	}

	api.getLocations = function(locationPath, cb) {
		locationPath = locationPath || '/locations';
		$http.get(url + locationPath).success(function(data, status, headers, config) {
			cb(null, data);
			$rootScope.$emit(api.onRetrievedLocations, {path: locationPath}, data)
		}).error(function() {
			alert('error')
		})
	}

	api.play = function(trackPath, cb) {
		$http.post(url + trackPath).success(function(data, status, headers, config) {
			if (cb) {
				cb(data);
			}
			$rootScope.$emit(api.onNewPlayerStatus, {path: trackPath}, data)
		}).error(function() {
			alert('error')
		})
	}

	return api;
}]);
