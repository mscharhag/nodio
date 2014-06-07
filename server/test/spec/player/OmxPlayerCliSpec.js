'use strict';
require('../../test.js');

var app = rek('app'),
	test = rek('test'),
	cli = rek('OmxPlayerCli'),
	cp = rek('child_process'),
	fs = rek('fs'),
	errors = rek('errors');

var pipe = '/ramdisk/omxplayer';


describe('OmxPlayerCli tests', function() {

	beforeEach(function() {
		spyOn(cp, 'exec');
	});

	describe('when it should play a track', function() {

		var startOmxplayerCmd = 'omxplayer --vol -1500 "/foo/bar.mp3" < /ramdisk/omxplayer';

		it('should start the player', function() {
			cli.play('/foo/bar.mp3', 15);
			expect(cp.exec.argsForCall[1][0]).toEqual(startOmxplayerCmd);
		});

		it('should push . to the pipe', function() {
			cli.play('/foo/bar.mp3', 15);
			expect(cp.exec.argsForCall[2]).toEqual(['echo . > /ramdisk/omxplayer', undefined]);
		});

		describe('when the pipe exists', function() {

			beforeEach(function() {
				spyOn(fs, 'existsSync').andReturn(true);
			});

			it('should flush the pipe before the player is started', function() {
				cli.play('/foo/bar.mp3', 15);
				expect(cp.exec.argsForCall[0]).toEqual(['dd if=' + pipe + ' iflag=nonblock of=/dev/null', undefined]);
			});
		});

		describe('when the pipe does not exist', function() {

			beforeEach(function() {
				spyOn(fs, 'existsSync').andReturn(false);
			});

			it('should create a new pipe', function() {
				cli.play('/foo/bar.mp3', 15);
				expect(cp.exec.argsForCall[0]).toEqual(['mkfifo /ramdisk/omxplayer', undefined]);
			});
		});
	});


	describe('when pause is called', function() {
		it('should push the pause key to the pipe', function() {
			cli.pause();
			expect(cp.exec).toHaveBeenCalledWith('echo -n p > /ramdisk/omxplayer', undefined);
		})
	});

	describe('when unpause is called', function() {
		it('should push the pause key to the pipe', function() {
			cli.unpause();
			expect(cp.exec).toHaveBeenCalledWith('echo -n p > /ramdisk/omxplayer', undefined);
		})
	});

	describe('when stop() is called', function() {
		it('should push the quit key to the pipe', function() {
			cli.stop();
			expect(cp.exec).toHaveBeenCalledWith('echo -n q > /ramdisk/omxplayer', undefined);
		})
	});

	describe('when the volume should be increased', function() {
		it('should push the plus key to the pipe', function() {
			cli.increaseVolume();
			expect(cp.exec).toHaveBeenCalledWith('echo -n + > /ramdisk/omxplayer', undefined);
		})
	});

	describe('when the volume should be decreased', function() {
		it('should push the minus key to the pipe', function() {
			cli.decreaseVolume();
			expect(cp.exec).toHaveBeenCalledWith('echo -n - > /ramdisk/omxplayer', undefined);
		})
	});

	describe('when it should convert the volume to millibels', function() {
		it('should return the correct results', function() {
			expect(cli.convertToMillibels(-100)).toEqual(-6000);
			expect(cli.convertToMillibels(-1)).toEqual(-6000);
			expect(cli.convertToMillibels(0)).toEqual(-6000);
			expect(cli.convertToMillibels(1)).toEqual(-5700);
			expect(cli.convertToMillibels(10)).toEqual(-3000);
			expect(cli.convertToMillibels(19)).toEqual(-300);
			expect(cli.convertToMillibels(20)).toEqual(0);
			expect(cli.convertToMillibels(21)).toEqual(0);
			expect(cli.convertToMillibels(100)).toEqual(0);
		});
	});

});