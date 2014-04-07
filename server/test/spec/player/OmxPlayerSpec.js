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
			'omxplayer --vol -3000 "/foo/bar/baz.mp3" < ' + pipe,
			'echo . > ' + pipe
		])).toBeTruthy();
		expect(player.getState()).toEqual('playing');
	});

	it('should play a track from playing state', function() {
		fs.existsSync = function() { return true };
		player._state = 'playing';
		player.play(test.track('/foo/bar/baz.mp3'));
		expect(_.isEqual(cmds, [
			'echo -n q > ' + pipe,
			'dd if=' + pipe + ' iflag=nonblock of=/dev/null',
			'omxplayer --vol -3000 "/foo/bar/baz.mp3" < ' + pipe,
			'echo . > ' + pipe
		])).toBeTruthy();
		expect(player.getState()).toEqual('playing');
	});

	it('should play a track with the correct initial volume', function() {
		fs.existsSync = function() { return false };
		player._state = 'stopped';
		player._volume = 5;
		player.play(test.track('/foo/bar/baz.mp3'));
		expect(_.isEqual(cmds, [
			'mkfifo ' + pipe,
			'omxplayer --vol -4500 "/foo/bar/baz.mp3" < ' + pipe,
			'echo . > ' + pipe
		])).toBeTruthy();
		expect(player.getState()).toEqual('playing');
	});

	it('should pause the player', function() {
		player._state = 'playing';
		player.pause();
		expect(_.isEqual(cmds, ['echo -n p > ' + pipe])).toBeTruthy();
		expect(player.getState()).toEqual('paused');
	});

	it('should unpause the player', function() {
		player._state = 'paused';
		player.unpause();
		expect(_.isEqual(cmds, ['echo -n p > ' + pipe])).toBeTruthy();
		expect(player.getState()).toEqual('playing');
	});

	it('should stop the player', function() {
		player._state = 'playing';
		player.stop();
		expect(_.isEqual(cmds, ['echo -n q > ' + pipe])).toBeTruthy();
		expect(player.getState()).toEqual('stopped');
	});

	it('should convert the values to millibels', function() {
		expect(player._toMillibels(-100)).toEqual(-6000);
		expect(player._toMillibels(-1)).toEqual(-6000);
		expect(player._toMillibels(0)).toEqual(-6000);
		expect(player._toMillibels(1)).toEqual(-5700);
		expect(player._toMillibels(10)).toEqual(-3000);
		expect(player._toMillibels(19)).toEqual(-300);
		expect(player._toMillibels(20)).toEqual(0);
		expect(player._toMillibels(21)).toEqual(0);
		expect(player._toMillibels(100)).toEqual(0);
	});

	it('should increase the volume', function() {
		player._volume = 5;
		player._state = 'playing';
		player.setVolume(15);
		expect(_.isEqual(cmds, _.range(10).map(function() {
			return 'echo -n + > ' + pipe
		}))).toBeTruthy();
	})

	it('should decrease the volume', function() {
		player._volume = 18;
		player._state = 'playing';
		player._pipe = pipe;
		player.setVolume(3);
		expect(_.isEqual(cmds, _.range(15).map(function() {
			return 'echo -n - > ' + pipe
		}))).toBeTruthy();
	})

});