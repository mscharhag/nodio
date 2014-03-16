'use strict';

var app = require('../../../app/app.js'),
	cp = rek('child_process'),
	fs = rek('fs'),
	test = rek('test'),
	OmxPlayer = rek('OmxPlayer');

describe('OmxPlayer tests', function() {

	var pipe = '/ramdisk/omxplayer'
	var exec = cp.exec;
	var existsSync = fs.existsSync;
	var player;
	var cmds;

	beforeEach(function() {
		player = new OmxPlayer();
		cmds = [];
		cp.exec = function(cmd) {
			cmds.push(cmd);
		}
	});

	afterEach(function() {
		cp.exec = exec;
		fs.existsSync = existsSync;
		console.log('cmds', cmds)
	})

	it('should play a track from stopped state', function() {
		fs.existsSync = function() { return false };
		player._state = 'stopped';
		player.play(test.track('/foo/bar/baz.mp3'));
		expect(_.isEqual(cmds, [
			'mkfifo ' + pipe,
			'omxplayer /foo/bar/baz.mp3 < ' + pipe,
			'echo . > ' + pipe
		])).toBeTruthy();
		// TODO: check _state after play()
	});

	it('should play a track from playing state', function() {
		fs.existsSync = function() { return true };
		player._state = 'playing';
		player.play(test.track('/foo/bar/baz.mp3'));
		expect(_.isEqual(cmds, [
			'echo -n q > ' + pipe,
			'dd if=' + pipe + ' iflag=nonblock of=/dev/null',
			'omxplayer /foo/bar/baz.mp3 < ' + pipe,
			'echo . > ' + pipe
		])).toBeTruthy();
	});

	it('should pause the player', function() {
		player._state = 'playing';
		player.pause();
		expect(_.isEqual(cmds, ['echo -n p > ' + pipe])).toBeTruthy();
	});

	it('should unpause the player', function() {
		player._state = 'paused';
		player.unpause();
		expect(_.isEqual(cmds, ['echo -n p > ' + pipe])).toBeTruthy();
	});

	it('should stop the player', function() {
		player._state = 'playing';
		player.stop();
		expect(_.isEqual(cmds, ['echo -n q > ' + pipe])).toBeTruthy();
	})


//
//	it('should increase the volume', function() {
//		player._volume = 0.36;
//		player._pipe = pipe;
//		player.setVolume(0.8);
//		expect(_.isEqual(cmds, _.range(17).map(function() {
//			return 'echo -n + > ' + pipe
//		}))).toBeTruthy();
//	})
//
//	it('should decrease the volume', function() {
//		player._volume = 0.61;
//		player._pipe = pipe;
//		player.setVolume(0.3);
//		expect(_.isEqual(cmds, _.range(12).map(function() {
//			return 'echo -n - > ' + pipe
//		}))).toBeTruthy();
//	})



});