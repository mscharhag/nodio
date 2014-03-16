'use strict';
require('../../../app/app.js');

var TrackLocation = rek('TrackLocation'),
	Track = rek('Track');

describe('Track tests', function() {

	var location;

	beforeEach(function() {
		location = new TrackLocation(new TrackLocation(), 'test-location', '/foo/bar');
	});

	it('should create a new Track', function() {
		var track = new Track(location, 'test.mp3');
		expect(track.getName()).toEqual('test.mp3');
		expect(track.getLocation()).toEqual(location);
		expect(track.getPath()).toEqual('/test-location/test.mp3');
		expect(track.getResourcePath()).toEqual('/foo/bar/test.mp3');
		expect(_.isEqual(location.getTracks(), [track])).toBeTruthy();
	});

});
