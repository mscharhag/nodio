var nodioClient = angular.module('nodioClient');

nodioClient.directive('slider', function ($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><input type="text" /></div>',

		link: function ($scope, element, attrs) {

			var model = $parse(attrs.model);
			var slider = $(element).children('input').slider();

			$scope.$watch(function() {
				return $(element).attr('value');
			}, function(value) {
				slider.slider('setValue', value);
			});

			var expr = $parse(attrs['ngSlidestop']);
			slider.on('slideStop', function(ev) {
				$scope.$apply(function() {
					expr($scope, {$event:ev});
				});
			});
		}
	}
});