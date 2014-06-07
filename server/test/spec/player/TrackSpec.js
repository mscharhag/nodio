'use strict';
require('../../test.js');

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


	describe('when the location only contains one track', function() {
		var track;

		beforeEach(function() {
			track = new Track(location, 'test.mp3');
		});

		it('should return no next track', function() {
			expect(track.getNextTrack()).toEqual(null);
		});

		it('should return no previous track', function() {
			expect(track.getPreviousTrack()).toEqual(null);
		});
	});

	describe('when the location contains more than one track', function() {
		var firstTrack, secondTrack;

		beforeEach(function() {
			firstTrack = new Track(location, 'first.mp3');
			secondTrack = new Track(location, 'second.mp3');
		});

		it('firstTrack should return secondTrack as next track', function() {
			expect(firstTrack.getNextTrack()).toEqual(secondTrack);
		});

		it('firstTrack should return no previous track', function() {
			expect(firstTrack.getPreviousTrack()).toEqual(null);
		});

		it('secondTrack should return no next track', function() {
			expect(secondTrack.getNextTrack()).toEqual(null);
		});

		it('secondTrack should return firstTrack as previous track', function() {
			expect(secondTrack.getPreviousTrack()).toEqual(firstTrack);
		});
	});


});
