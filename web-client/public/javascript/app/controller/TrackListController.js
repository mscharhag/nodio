var nodioClient = angular.module('nodioClient', []);

nodioClient.controller('trackListController', ['$scope', '$http', 'api', function ($scope, $http, api) {

	function onGetLocationComplete(err, data, status) {
		$scope.location = data;
	}

	$scope.getLocation = function(path) {
		api.getLocations(path, onGetLocationComplete);
	};

	$scope.play = function(track) {
		api.play(track);
	};

	api.getLocations(null, onGetLocationComplete)

}]);