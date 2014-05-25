'use strict';
var app = require('../../../../app/app.js');

var player = rek('playerController'),
	Track = rek('Track'),
	TrackLocation = rek('TrackLocation');

describe('player tests', function() {

	var req, res;
	beforeEach(function() {
		req = {
			query : {}
		};
		res = {
			dto : jasmine.createSpy('dto'),
			json : jasmine.createSpy('json')
		}
	});

	it('should pause the player', function() {
		req.query.action = 'pause';
		spyOn(app.audioPlayer, 'pause');
		player.updateStatus(req, res);
		expect(app.audioPlayer.pause).toHaveBeenCalled();
	});

	it('should stop the player', function() {
		req.query.action = 'stop';
		spyOn(app.audioPlayer, 'stop');
		player.updateStatus(req, res);
		expect(app.audioPlayer.stop).toHaveBeenCalled();
	});

	it('should unpause the player', function() {
		req.query.action = 'unpause';
		spyOn(app.audioPlayer, 'unpause');
		player.updateStatus(req, res);
		expect(app.audioPlayer.unpause).toHaveBeenCalled();
	});

	it('should fail if an invalid action is passed as parameter', function() {
		req.query.action = 'foo';
		expect(function() {
			player.updateStatus(req, res);
		}).toFail(1003, '"foo" is not a valid action');
	});

	describe('when a track should be played', function() {

		it('should obtain the track from the trackRepository and pass it to the audioPlayer', function() {
			req.query.action = 'play';
			req.query.track = '/foo/bar.mp3';
			var track = new Track(new TrackLocation(), 'foo.mp3');
			spyOn(app.trackRepository, 'getTrack').andReturn(track);
			spyOn(app.audioPlayer, 'play');
			player.updateStatus(req, res);
			expect(app.trackRepository.getTrack).toHaveBeenCalledWith('/foo/bar.mp3');
			expect(app.audioPlayer.play).toHaveBeenCalledWith(track);
		});

		it('should fail if no track parameter is passed', function() {
			req.query.action = 'play';
			expect(function() {
				player.updateStatus(req, res);
			}).toFail(1003, 'Parameter "track" is required for action "play"');
		});

		it('should fail if the trackRepository returns no track for the passed track parameter', function() {
			req.query.action = 'play';
			req.query.track = '/foo/bar.mp3';
			spyOn(app.trackRepository, 'getTrack').andReturn(null);
			expect(function() {
				player.updateStatus(req, res);
			}).toFail(1001, 'Track "/foo/bar.mp3" not found');
		});
	});

	describe('when the volume should be changed', function() {
		it('should pass the volume to the audioPlayer', function() {
			req.query.volume = '5';
			spyOn(app.audioPlayer, 'setVolume');
			player.updateStatus(req, res);
			expect(app.audioPlayer.setVolume).toHaveBeenCalledWith(5);
		});

		it('should fail if no number is passed as volume', function() {
			req.query.volume = 'foo';
			spyOn(app.audioPlayer, 'setVolume');
			expect(function() {
				player.updateStatus(req, res);
			}).toFail(1003, 'Volume has to be a number');
		});
	});
});
