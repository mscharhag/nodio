var nodioClient = angular.module('nodioClient', []);

nodioClient.controller('tracksController', ['$scope', '$http', 'api', function ($scope, $http, api) {

	function onGetLocationComplete(err, data, status) {
		$scope.locations = data.locations;
		$scope.tracks = data.tracks;
	}

	$scope.getLocation = function(path) {
		api.getLocations(path, onGetLocationComplete);
	}

	$scope.play = function(track) {
		api.play(track);
	}

	api.getLocations(null, onGetLocationComplete)

}]);


$(function() {
	$('.slider-volume input, .slider-seeker input').slider()
	$('.slider').attr('style', '')
});