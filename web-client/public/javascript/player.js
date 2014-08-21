var nodioClient = angular.module('nodioClient');

nodioClient.controller('myController', function ($scope, $http) {
	$scope.phones = [
		{'name': 'Nexus S',
			'snippet': 'Fast just got faster with Nexus S.'},
		{'name': 'Motorola XOOM™ with Wi-Fi',
			'snippet': 'The Next, Next Generation tablet.'},
		{'name': 'MOTOROLA XOOM™',
			'snippet': 'The Next, Next Generation tablet.'}
	];

	$scope.getLocation = function(loc) {
		$http.get('http://192.168.1.8:3000' + loc).success(function(data, status, headers, config) {
			console.log(data.locations)
			$scope.locations = data.locations
			$scope.tracks = data.tracks
		}).error(function() {
			alert('err');
		})
	}

	$scope.play =function(track) {
		$http.get('http://192.168.1.8:3000' + track).success(function(data, status, headers, config) {
			console.log('data: ', data);
		})
	}

	$http.get('http://192.168.1.8:3000/locations').success(function(data, status, headers, config) {
		console.log(data.locations)
		$scope.locations = data.locations
		$scope.tracks = data.tracks
	}).error(function() {
		alert('err');
	})

});


$(function() {
	$('.slider-volume input, .slider-seeker input').slider()
	$('.slider').attr('style', '')
});