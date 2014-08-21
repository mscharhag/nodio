var nodioClient = angular.module('nodioClient');

nodioClient.controller('playerController', function ($scope, $http, api, $rootScope) {

	$rootScope.$on(api.onNewPlayerStatus, function(event, req, data) {
		$scope.status = data;
		console.log('refreshed data..');
	});

	$scope.action = function(url) {
//		api.changeVolume($scope.status.volume + 1);
//		api.playerAction(url)
		api.action(url);
	};

	$scope.changeVolume = function(value) {
		console.log('changeVolume', value);
		api.changeVolume(value);
	};
	api.status();
//	api.getPlayerStatus();
});
$(function() {
	$('.slider-volume input, .slider-seeker input').slider()
	$('.slider').attr('style', '')
});




nodioClient.directive('slider', function ($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><input type="text" /></div>',
		link: function ($scope, element, attrs) {
			var model = $parse(attrs.model);
			var input = $(element).children('input');
			var slider = input.slider();

//			$scope.$watch('status.volume', function(value) {
//			//	slider.slider('setValue', value);
//				console.log("updated slider.. " + value);
//			});
			$scope.$watch(function() {
				return $(element).attr('value');
			}, function(value) {
				slider.slider('setValue', value);
				console.log("updated slider.. " + value);
			});
			var expr = attrs['ngSlidestop'];
			var stuff = $parse(expr);
//
			slider.on('slideStop', function(ev) {
//				$scope.changeVolume(ev.value);

				$scope.$apply(function() {
					stuff($scope, {$event:ev});
				});

//				model.assign($scope, ev.value);
//				$scope.$apply();
			});
		}
	}
});