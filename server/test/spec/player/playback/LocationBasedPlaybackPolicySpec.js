'use strict';
require('../../../test.js');

var app = rek('app'),
	TrackLocation = rek('TrackLocation'),
	Track = rek('Track'),
	LocationBasedPlaybackPolicy = rek('LocationBasedPlaybackPolicy');

describe('LocationBasedPlaybackPolicy tests', function() {

	var policy;

	var location;
	var tracks;

	beforeEach(function() {
		location = new TrackLocation();
		tracks = [
			new Track(location, 'track-A'),
			new Track(location, 'track-B'),
			new Track(location, 'track-C')
		]
	});


	describe('when shuffle option is set', function() {

		function getNextTracks(numberOfRequests, initialTrack) {
			var track = initialTrack;
			var returnValues = [];
			for (var i = 0; i < numberOfRequests; i++) {
				track = policy.getNextTrack(track);
				returnValues.push(track);
			}
			return returnValues;
		}

		describe('when repeat option is set', function() {

			beforeEach(function() {
				policy = new LocationBasedPlaybackPolicy(true, true);
			});

			it('should return the next track', function() {
				var sorted = _.chain(getNextTracks(5, tracks[1]))
					.map(function(item) { return item.getName() })
					.sort(function(first, second) { return first > second; })
					.value();
				expect(sorted).toEqual(['track-A', 'track-A', 'track-B', 'track-C', 'track-C'])
			});

			it('should shuffle the tracks', function() {
				var first = getNextTracks(10, tracks[0]);
				var second = getNextTracks(10, tracks[0]);
				expect(first).not.toEqual(second);
			});

			it('should always return the same track if the location only contains one track', function() {
				var track = new Track(new TrackLocation(), 'test');
				var nextTracks = getNextTracks(2, track);

				expect(nextTracks[0]).toEqual(track);
				expect(nextTracks[1]).toEqual(track);
			});
		});

		describe('when repeat option is not set', function() {

			beforeEach(function() {
				policy = new LocationBasedPlaybackPolicy(true, false);
			});

			it('should return the next track', function() {
				var nextTracks = getNextTracks(2, tracks[0]);
				expect(nextTracks[0] === tracks[1] || nextTracks[0] === tracks[2]).toBeTruthy();
				expect(nextTracks[1] === tracks[1] || nextTracks[1] === tracks[2]).toBeTruthy();
				expect(nextTracks[0] !== nextTracks[1]).toBeTruthy();
			});

			it('should return null because there is no next track', function() {
				var nextTracks = getNextTracks(3, tracks[0]);
				expect(nextTracks[2]).toBeNull();
			});

			it('should return null if the location only contains one track', function() {
				var track = new Track(new TrackLocation(), 'test');
				var nextTrack = policy.getNextTrack(track);
				expect(nextTrack).toBeNull();
			});
		});

	});

	describe('when shuffle option is not set', function() {

		describe('when repeat option is set', function() {

			beforeEach(function() {
				policy = new LocationBasedPlaybackPolicy(false, true);
			});

			it('should return the next track', function() {
				var nextTrack = policy.getNextTrack(tracks[1]);
				expect(nextTrack).toEqual(tracks[2]);
			});

			it('should repeat with the first track', function() {
				var nextTrack = policy.getNextTrack(tracks[2]);
				expect(nextTrack).toEqual(tracks[0]);
			});
		});

		describe('when repeat option is not set', function() {

			beforeEach(function() {
				policy = new LocationBasedPlaybackPolicy(false, false);
			});

			it('should return the next track', function() {
				var nextTrack = policy.getNextTrack(tracks[1]);
				expect(nextTrack).toEqual(tracks[2]);
			});

			it('should return null because there is no next track', function() {
				var nextTrack = policy.getNextTrack(tracks[2]);
				expect(nextTrack).toBeNull();
			});
		});

	});

});