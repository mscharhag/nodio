'use strict';

var app = require('../../../app/app.js'),
	test = rek('test'),
	cli = rek('OmxPlayerCli'),
	errors = rek('errors'),
	OmxPlayer = rek('OmxPlayer');

describe('OmxPlayer tests', function() {

	var player;

	beforeEach(function() {
		spyOn(cli, 'execute');
		player = new OmxPlayer();
	});

	describe('when it should play a track', function() {

		var track = test.track('/foo/bar/baz.mp3');

		beforeEach(function() {
			spyOn(cli, 'play');
			spyOn(cli, 'stop');
		});

		it('should change the state to playing', function() {
			player.play(track);
			expect(player.getState()).toEqual('playing');
		});

		it('should pass the correct path and volume to the CLI', function() {
			player.setVolume(5);
			player.play(track);
			expect(cli.play).toHaveBeenCalledWith('/foo/bar/baz.mp3', 5)
		});

		it('should stop the track that is currently played before playing the new track', function() {
			player._state = 'playing';
			player.play(track);
			expect(cli.stop).toHaveBeenCalled();
		});

		it('should stop the track that is currently paused before playing the new track', function() {
			player._state = 'paused';
			player.play(track);
			expect(cli.stop).toHaveBeenCalled();
		});

		it('should not call stop() from CLI if there is no paused or playing track', function() {
			player._state = 'stopped';
			player.play(track);
			expect(cli.stop.callCount).toEqual(0);
		});
	});


	describe('when it should pause a track', function() {

		beforeEach(function() {
			player._state = 'playing';
			spyOn(cli, 'pause');
		});

		it('should change the state to pause', function() {
			player.pause();
			expect(player.getState()).toEqual('paused');
		});

		it('should call pause() of the CLI', function() {
			player.pause();
			expect(cli.pause).toHaveBeenCalled();
		});

		it('should fail if the player is already paused', function() {
			player._state = 'paused';
			expect(function() {
				player.pause();
			}).toFail(1002, 'Cannot pause player. Player is not playing.');
		});

		it('should fail if the player is stopped', function() {
			player._state = 'stopped';
			expect(function() {
				player.pause();
			}).toFail(1002, 'Cannot pause player. Player is not playing.');
		});
	});


	describe('when it should unpause a track', function() {

		beforeEach(function() {
			player._state = 'paused';
			spyOn(cli, 'unpause');
		});

		it('should change the state to playing', function() {
			player.unpause();
			expect(player.getState()).toEqual('playing');
		});

		it('should call unpause() of the CLI', function() {
			player.unpause();
			expect(cli.unpause).toHaveBeenCalled();
		});

		it('should fail if the player is currently playing', function() {
			player._state = 'playing';
			expect(function() {
				player.unpause();
			}).toFail(1002, 'Cannot unpause player. Player is not paused');
		});

		it('should fail if the player is stopped', function() {
			player._state = 'stopped';
			expect(function() {
				player.unpause();
			}).toFail(1002, 'Cannot unpause player. Player is not paused');
		});
	});


	describe('when it should stop the player', function() {

		beforeEach(function() {
			player._state = 'playing';
			spyOn(cli, 'stop');
		});

		it('should change the state to stopped', function() {
			player.stop();
			expect(player.getState()).toEqual('stopped');
		});

		it('should call stop() of the CLI', function() {
			player.stop();
			expect(cli.stop).toHaveBeenCalled();
		});

		it('should fail if the player is already stopped', function() {
			player._state = 'stopped';
			expect(function() {
				player.stop();
			}).toFail(1002, 'Cannot stop player. Player is already stopped');
		});

	});


	describe('when it should change the volume', function() {

		beforeEach(function() {
			player._volume = 10;
			spyOn(cli, 'increaseVolume');
			spyOn(cli, 'decreaseVolume');
		});

		it('should fail if a negative value is passed', function() {
			expect(function() {
				player.setVolume(-1);
			}).toFail(1003, 'Volume has to be a number between 0 and 20.');
		});

		it('should fail if the passed value is too high', function() {
			expect(function() {
				player.setVolume(21);
			}).toFail(1003, 'Volume has to be a number between 0 and 20.');
		});

		it('should fail if no number is passed', function() {
			expect(function() {
				player.setVolume('foo');
			}).toFail(1003, 'Volume has to be a number between 0 and 20.');
		});

		describe('when the player is stopped', function() {

			beforeEach(function() {
				player._state = 'stopped';
			});

			it('should not call the CLI', function() {
				player.setVolume(5);
				expect(cli.increaseVolume.callCount).toEqual(0);
				expect(cli.decreaseVolume.callCount).toEqual(0);
			});

			it('should update the volume', function() {
				player.setVolume(5);
				expect(player.getVolume()).toEqual(5);
			});
		});

		describe('when the player volume should be increased', function() {

			beforeEach(function() {
				player._state = 'playing';
			});

			it('should call increaseVolume() of the CLI', function() {
				player.setVolume(18);
				expect(cli.increaseVolume.callCount).toEqual(8);
			});

			it('should not call decreaseVolume() of the CLI', function() {
				expect(cli.decreaseVolume.callCount).toEqual(0);
			});

			it('should update the volume', function() {
				player.setVolume(18);
				expect(player.getVolume()).toEqual(18);
			});
		});

		describe('when the player volume should be decreased', function() {

			beforeEach(function() {
				player._state = 'playing';
			});

			it('should call decreaseVolume() of the CLI', function() {
				player.setVolume(5);
				expect(cli.decreaseVolume.callCount).toEqual(5);
			});

			it('should not call increaseVolume() of the CLI', function() {
				expect(cli.increaseVolume.callCount).toEqual(0);
			});

			it('should update the volume', function() {
				player.setVolume(5);
				expect(player.getVolume()).toEqual(5);
			});
		});
	});

});