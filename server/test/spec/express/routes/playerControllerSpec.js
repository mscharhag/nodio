'use strict';
var app = require('../../../../app/app.js');

var controller = rek('playerController'),
	Track = rek('Track'),
	errors = rek('errors'),
	OmxPlayer = rek('OmxPlayer'),
	LocationBasedPlaybackPolicy = rek('LocationBasedPlaybackPolicy'),
	TrackBasedPlaybackPolicy = rek('TrackBasedPlaybackPolicy'),
	TrackLocation = rek('TrackLocation'),
	extensions = rek('request-util'),
	test = rek('test');

describe('player tests', function() {

	var req, res;
	beforeEach(function() {
		req = {
			query : {}
		};
		extensions()(req);
		res = {
			dto : jasmine.createSpy('dto'),
			json : jasmine.createSpy('json')
		}
	});

	it('should pause the player', function() {
		req.query.action = 'pause';
		spyOn(app.audioPlayer, 'pause');
		controller.updateStatus(req, res);
		expect(app.audioPlayer.pause).toHaveBeenCalled();
	});

	it('should stop the player', function() {
		req.query.action = 'stop';
		spyOn(app.audioPlayer, 'stop');
		controller.updateStatus(req, res);
		expect(app.audioPlayer.stop).toHaveBeenCalled();
	});

	it('should unpause the player', function() {
		req.query.action = 'unpause';
		spyOn(app.audioPlayer, 'unpause');
		controller.updateStatus(req, res);
		expect(app.audioPlayer.unpause).toHaveBeenCalled();
	});

	it('should fail if an invalid action is passed as parameter', function() {
		req.query.action = 'foo';
		expect(function() {
			controller.updateStatus(req, res);
		}).toFail(errors.CODE_ILLEGAL_ARGUMENT, '"foo" is not a valid action');
	});

	describe('when a track should be played', function() {

		it('should obtain the track from the trackRepository and pass it to the audioPlayer', function() {
			req.query.action = 'play';
			req.query.track = '/foo/bar.mp3';
			var track = new Track(new TrackLocation(), 'foo.mp3');
			spyOn(app.trackRepository, 'getTrack').andReturn(track);
			spyOn(app.audioPlayer, 'play');
			controller.updateStatus(req, res);
			expect(app.trackRepository.getTrack).toHaveBeenCalledWith('/foo/bar.mp3');
			expect(app.audioPlayer.play).toHaveBeenCalledWith(track);
		});

		it('should fail if no track parameter is passed', function() {
			req.query.action = 'play';
			expect(function() {
				controller.updateStatus(req, res);
			}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Parameter "track" is required for action "play"');
		});

		it('should fail if the trackRepository returns no track for the passed track parameter', function() {
			req.query.action = 'play';
			req.query.track = '/foo/bar.mp3';
			spyOn(app.trackRepository, 'getTrack').andReturn(null);
			expect(function() {
				controller.updateStatus(req, res);
			}).toFail(errors.CODE_TRACK_NOT_FOUND, 'Track "/foo/bar.mp3" not found');
		});
	});

	describe('when the volume should be changed', function() {
		it('should pass the volume to the audioPlayer', function() {
			req.query.volume = '5';
			spyOn(app.audioPlayer, 'setVolume');
			controller.updateStatus(req, res);
			expect(app.audioPlayer.setVolume).toHaveBeenCalledWith(5);
		});

		it('should fail if no number is passed as volume', function() {
			req.query.volume = 'foo';
			spyOn(app.audioPlayer, 'setVolume');
			expect(function() {
				controller.updateStatus(req, res);
			}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Volume has to be a number');
		});
	});

	describe('when the playback policy should be changed', function() {

		function newPolicy() {
			return app.audioPlayer.setPlaybackPolicy.argsForCall[0][0];
		}

		beforeEach(function() {
			spyOn(app.audioPlayer, 'setPlaybackPolicy');
			req.withPlayback = function(type, shuffle, repeat) {
				req.query['playback-type'] = type || undefined;
				req.query['playback-isShuffling'] = shuffle || undefined;
				req.query['playback-isRepeating'] = repeat || undefined;
				return req;
			}
		});

		describe('when playback type "location" is used', function() {

			it('should changed the playback policy to LocationBasedPlaybackPolicy', function() {
				controller.updateStatus(req.withPlayback('location'), res);
				expect(app.audioPlayer.setPlaybackPolicy).toHaveBeenCalled();
				expect(newPolicy().constructor.name).toEqual('LocationBasedPlaybackPolicy');
			});

			it('should initialize the new playback policy with correct default values', function() {
				controller.updateStatus(req.withPlayback('location'), res);
				expect(newPolicy().isRepeating()).toBeTruthy();
				expect(newPolicy().isShuffling()).toBeFalsy();
			});

			it('should set the correct value for isRepeating', function() {
				controller.updateStatus(req.withPlayback('location', undefined, 'true'), res);
				expect(newPolicy().isRepeating).toBeTruthy();
			});

			it('should set the correct value for isShuffling', function() {
				controller.updateStatus(req.withPlayback('location', 'true'), res);
				expect(newPolicy().isShuffling()).toBeTruthy();
			});
		});

		describe('when playback type "track" is used', function() {

			it('should changed the playback policy to TrackBasedPlaybackPolicy', function() {
				controller.updateStatus(req.withPlayback('track'), res);
				expect(app.audioPlayer.setPlaybackPolicy).toHaveBeenCalled();
				expect(newPolicy().constructor.name).toEqual('TrackBasedPlaybackPolicy');
			});

			it('should initialize the new playback policy with the correct default value for isRepeating', function() {
				controller.updateStatus(req.withPlayback('track'), res);
				expect(newPolicy().isRepeating()).toBeTruthy();
			});

			it('should set the correct value for isRepeating', function() {
				controller.updateStatus(req.withPlayback('track', undefined, 'true'), res);
				expect(newPolicy().isRepeating).toBeTruthy();
			});
		});

		describe('when invalid arguments are provided', function() {

			it('should fail if an invalid value for "playback-type" is passed', function() {
				expect(function() {
					controller.updateStatus(req.withPlayback('test'), res);
				}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Parameter "playback-type" has to be "location" or "track".');
			});

			it('should fail if an invalid value for "playback-isRepeating" is passed', function() {
				expect(function() {
					controller.updateStatus(req.withPlayback('track', undefined, 'foo'), res);
				}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Parameter "playback-isRepeating" has to be "true" or "false".');
			});

			it('should fail if an invalid value for "playback-isShuffling" is passed', function() {
				expect(function() {
					controller.updateStatus(req.withPlayback('track', 'foo'), res);
				}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Parameter "playback-isShuffling" has to be "true" or "false".');
			});

			it('should fail if a value "playback-isShuffling" is passed when "playback-type" is "track"', function() {
				expect(function() {
					controller.updateStatus(req.withPlayback('track', 'true', 'true'), res);
				}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Parameter "playback-isShuffling" is not allowed if "playback-type" is "track"');
			});

			it('should fail if "playback-isShuffling" or "playback-isRepeating" is used with "playback-type"', function() {
				expect(function() {
					controller.updateStatus(req.withPlayback(undefined, 'true', 'true'), res);
				}).toFail(errors.CODE_ILLEGAL_ARGUMENT, 'Parameter "playback-type" has to be "location" or "track".');
			});
		});

	});
});
