'use strict';
var app = require('../../../app/app.js'),
	Track = rek('Track'),
	TrackLocation = rek('TrackLocation'),
	OmxPlayer = rek('OmxPlayer'),
	LocationBasedPlaybackPolicy = rek('LocationBasedPlaybackPolicy'),
	mapping = rek('json-mapping');

describe('json mapping tests', function() {

	describe('mapping simple tracks', function() {

		it('should only export the name and a play link', function() {
			var track = new Track(new TrackLocation(), 'foo.mp3');
			expect(mapping.simpleTrack(track)).toEqual({
				name : 'foo.mp3',
				links : {
					play : '/player?action=play&track=/foo.mp3'
				}
			});
		});

	});

	describe('mapping simple locations', function() {

		it('should only export the name and a self link', function() {
			var parent = new TrackLocation(null, 'parent');
			var location = new TrackLocation(parent, 'location');
			expect(mapping.simpleTrackLocation(location)).toEqual({
				name : 'location',
				links : {
					self : '/locations/location'
				}
			})
		});
	});

	describe('mapping full locations', function() {

		it('should export the name', function() {
			var location = new TrackLocation(null, 'location');
			expect(mapping.fullTrackLocation(location).name).toEqual('location');
		});

		it('should export the track list', function() {
			var location = new TrackLocation(null, 'location');
			new Track(location, 'a.mp3');
			new Track(location, 'b.mp3');
			var tracks = mapping.fullTrackLocation(location).tracks;
			expect(_.map(tracks, function(item) { return item.name })).toEqual(['a.mp3', 'b.mp3']);
		});

		it('should export the list of sub locations', function() {
			var location = new TrackLocation(null, 'location');
			new TrackLocation(location, 'sub-location-a');
			new TrackLocation(location, 'sub-location-b');
			var locations = mapping.fullTrackLocation(location).locations;
			expect(_.map(locations, function(item) { return item.name })).toEqual(['sub-location-a', 'sub-location-b']);
		});

		it('should export a self link', function() {
			var location = new TrackLocation(null, 'location');
			expect(mapping.fullTrackLocation(location).links.self).toEqual('/locations')
		});

		it('should export a parent link if a parent is available', function() {
			var parent = new TrackLocation(null, 'parent');
			var location = new TrackLocation(parent, 'location');
			expect(mapping.fullTrackLocation(location).links.parent).toEqual('/locations')
		});

		it('should not export a parent link if no parent is available', function() {
			var location = new TrackLocation(null, 'location');
			expect(mapping.fullTrackLocation(location).links.parent).toBeUndefined();
		})
	});


	/*
	 var track = player.getCurrentTrack();
	 return {
		 state : player.getState(),
		 volume : player.getVolume(),
		 playbackPolicy : playbackPolicy(player.getPlaybackPolicy()),
		 currentTrack : track ? exports.simpleTrack(track) : null,
		 links : links('/player')
			 .self()
			 .addWhen(player.canPause(), 'pause', '?action=pause')
			 .addWhen(player.canUnpause(), 'unpause', '?action=unpause')
			 .addWhen(player.canStop(), 'stop', '?action=stop')
			 .build()
	 }
	 */

	describe('mapping omx player', function() {

		var player;
		beforeEach(function() {
			player = new OmxPlayer();
		});

		it('should export the current player state', function() {
			player._state = 'playing';
			expect(mapping.fullOmxPlayer(player).state).toEqual('playing');
		});

		it('should export the current volume', function() {
			player._volume = 5;
			expect(mapping.fullOmxPlayer(player).volume).toEqual(5);
		});

		it('should export the current track if available', function() {
			player._currentTrack = new Track(new TrackLocation(), 'foo.mp3');
			expect(mapping.fullOmxPlayer(player).currentTrack.name).toEqual('foo.mp3');
		});

		it('should export null as the current track if no current track is available', function() {
			expect(mapping.fullOmxPlayer(player).currentTrack).toBeNull();
		});

		it('should export the playback policy', function() {
			player._playbackPolicy = new LocationBasedPlaybackPolicy();
			expect(mapping.fullOmxPlayer(player).playbackPolicy.type).toEqual('location');
		});

	});

	describe('mapping playback policies', function() {

		it('should export type, repeating and shuffling properties for LocationBasedPlaybackPolicy', function() {
			var policy = new LocationBasedPlaybackPolicy(true, false);
			expect(mapping.fullPlaybackPolicy(policy)).toEqual({
				type : 'location',
				isShuffling : true,
				isRepeating : false
			});
		})
	});

});
