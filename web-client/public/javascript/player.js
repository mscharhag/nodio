var nodioClient = angular.module('nodioClient');

nodioClient.controller('playerController', function ($scope, $http, api, $rootScope) {

	$rootScope.$on(api.onNewPlayerStatus, function(event, req, data) {
		$scope.status = data;
	})

	$scope.action = function(url) {
		api.action(url)
	}


});


$(function() {
	$('.slider-volume input, .slider-seeker input').slider()
	$('.slider').attr('style', '')
});