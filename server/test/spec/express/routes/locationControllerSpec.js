'use strict';
require('../../../test.js');

var controller = rek('locationController'),
	TrackLocation = rek('TrackLocation'),
	errors = rek('errors'),
	app = rek('app');

describe('tracks tests', function() {

	var location = new TrackLocation(null, 'test');
	var res;

	beforeEach(function() {
		res = { dto : jasmine.createSpy('dto') }
	});

	it('should pass the location from the repository to the dto method', function() {
		spyOn(app.trackRepository, 'findLocation').andReturn(location);
		controller.getLocation({ url: '/locations' }, res);
		expect(res.dto).toHaveBeenCalledWith(location);
	});

	it('should throw an exception if no location for the passed path exists', function() {
		spyOn(app.trackRepository, 'findLocation').andReturn(null);
		expect(function() {
			controller.getLocation({ url: '/locations/foo' }, res);
		}).toFail(errors.CODE_LOCATION_NOT_FOUND, 'Location "/foo" not found');
	});

	describe('when resolving the track location path from the url', function() {

		beforeEach(function() {
			spyOn(app.trackRepository, 'findLocation').andReturn(location);
		});

		it('should use / as location path if the url does not contain a location path', function() {
			controller.getLocation({ url: '/locations' }, res);
			expect(app.trackRepository.findLocation).toHaveBeenCalledWith('/');
		});

		it('should extract the location path from the url', function() {
			controller.getLocation({ url: '/locations/foo/bar/baz' }, res);
			expect(app.trackRepository.findLocation).toHaveBeenCalledWith('/foo/bar/baz');
		});

		it('should ignore trailing slashes in the url when resolving the location path', function() {
			controller.getLocation({ url: '/locations/foo/' }, res);
			expect(app.trackRepository.findLocation).toHaveBeenCalledWith('/foo');
		});
	});


});
