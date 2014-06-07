'use strict';

var cp = rek('child_process'),
	fs = rek('fs'),
	config = rek('config'),
	errors = rek('errors');

var actions = {
	'pause' : 'p',
	'unpause' : 'p',
	'increaseVolume' : '+',
	'decreaseVolume' : '-',
	'stop' : 'q'
};

var pipe = config.player.pipeLoction;

exports.play = function(trackPath, volume, onPlaybackFinished) {
	preparePipe();
	var trackPath = '"' +  trackPath + '"';
	var volume = '--vol ' + convertToMillibels(volume) + ' ';
	var cmd = 'omxplayer ' + volume + trackPath + ' < ' + pipe;
	exports.execute(cmd, onPlaybackFinished);
	exports.execute('echo . > ' + pipe);
};


exports.pause = function() {
	pushToPipe(actions.pause);
};

exports.unpause = function() {
	pushToPipe(actions.unpause);
};

exports.stop = function() {
	pushToPipe(actions.stop);
};

exports.increaseVolume = function() {
	pushToPipe(actions.increaseVolume);
};

exports.decreaseVolume = function() {
	pushToPipe(actions.decreaseVolume);
};

var preparePipe = exports.preparePipe = function() {
	if (fs.existsSync(pipe)) {
		// flush pipe
		exports.execute('dd if=' + pipe + ' iflag=nonblock of=/dev/null');
	} else {
		exports.execute('mkfifo ' + pipe);
	}
};

var pushToPipe = exports.pushToPipe = function(key) {
	assert(key);
	exports.execute('echo -n ' + key + ' > ' + pipe);
};

exports.execute = function(cmd, cb) {
	cp.exec(cmd, cb);
	log.debug('Executed command: ' + cmd);
};

var convertToMillibels = exports.convertToMillibels = function(value) {
	// 0 -> -6000mB
	// 20 -> 0mB
	assert(typeof value === 'number');
	var millibel = (value - 20) * 300;
	return Math.clamp(millibel, -6000, 0);
}