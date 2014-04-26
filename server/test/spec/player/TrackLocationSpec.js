'use strict';
require('../../../app/app.js');

var TrackLocation = rek('TrackLocation'),
	Track = rek('Track');

describe('Location tests', function() {

	var baseLocation, locationA, locationB, subLocationA;
	var trackA1, trackA2, trackB1, trackSubA1;

	beforeEach(function() {
		baseLocation = new TrackLocation();
		locationA = new TrackLocation(baseLocation, 'a', '/res/res-a');
		locationB = new TrackLocation(baseLocation, 'b', '/res/res-b');
		subLocationA = new TrackLocation(locationA, 'sub-a', 'res/res-a/sub-a');
		trackA1 = new Track(locationA, 'track-a1');
		trackA2 = new Track(locationA, 'track-a2');
		trackB1 = new Track(locationB, 'track-b1');
		trackSubA1 = new Track(subLocationA, 'track-sub-a1');
	});

	it('should return the correct parent', function() {
		expect(baseLocation.getParent()).toEqual(null);
		expect(locationA.getParent()).toEqual(baseLocation);
		expect(subLocationA.getParent()).toEqual(locationA);
	})

	it('should return the correction location path', function() {
		expect(baseLocation.getPath()).toEqual('/');
		expect(locationA.getPath()).toEqual('/a');
		expect(subLocationA.getPath()).toEqual('/a/sub-a');
	});

	it('should return a list of sub locations', function() {
		expect(_.isEqual(baseLocation.getLocations(), [locationA, locationB])).toBeTruthy();
		expect(_.isEqual(locationA.getLocations(), [subLocationA])).toBeTruthy();
		expect(subLocationA.getLocations().length).toEqual(0);
		expect(locationB.getLocations().length).toEqual(0);
	});

	it('should return the correct sub location', function() {
		expect(baseLocation.getLocation('a')).toEqual(locationA);
		expect(baseLocation.getLocation('b')).toEqual(locationB);
		expect(locationA.getLocation('sub-a')).toEqual(subLocationA);
		expect(baseLocation.getLocation('doesNotExist')).toEqual(null);
		expect(baseLocation.getLocation('')).toEqual(null);
		expect(baseLocation.getLocation()).toEqual(null);
	});

	it('should find the correct sub location', function() {
		expect(baseLocation.findLocation('/a')).toEqual(locationA);
		expect(baseLocation.findLocation('a')).toEqual(locationA);
		expect(baseLocation.findLocation('/a/sub-a')).toEqual(subLocationA);
		expect(baseLocation.findLocation('a/sub-a')).toEqual(subLocationA);
		expect(baseLocation.findLocation('/')).toEqual(baseLocation);
		expect(baseLocation.findLocation('/a/b')).toEqual(null);
		expect(baseLocation.findLocation('a/b')).toEqual(null);
		expect(baseLocation.findLocation('a/')).toEqual(null);
		expect(baseLocation.findLocation('c')).toEqual(null);
		expect(baseLocation.findLocation('a//b')).toEqual(null);
		expect(baseLocation.findLocation('')).toEqual(null);
		expect(baseLocation.findLocation()).toEqual(null);
	});

	it('should find the correct tracks', function() {
		expect(baseLocation.findTrack('/a/track-a1')).toEqual(trackA1);
		expect(baseLocation.findTrack('a/track-a1')).toEqual(trackA1);
		expect(baseLocation.findTrack('/a/track-a2')).toEqual(trackA2);
		expect(baseLocation.findTrack('/a/track-b1')).toEqual(null);
		expect(baseLocation.findTrack('/b/track-b1')).toEqual(trackB1);
		expect(baseLocation.findTrack('/a/sub-a/track-sub-a1')).toEqual(trackSubA1);
		expect(baseLocation.findTrack('/a/sub-a/track-sub-a1/')).toEqual(null);
		expect(baseLocation.findTrack('/a/track-sub-a1')).toEqual(null);
		expect(baseLocation.findTrack('/doesNotExist')).toEqual(null);
		expect(baseLocation.findTrack('/doesNotExist/track')).toEqual(null);
		expect(baseLocation.findTrack('//')).toEqual(null);
		expect(baseLocation.findTrack('/')).toEqual(null);
		expect(baseLocation.findTrack('')).toEqual(null);
		expect(baseLocation.findTrack()).toEqual(null);
	});

});
