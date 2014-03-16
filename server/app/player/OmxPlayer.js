'use strict';

var cp = rek('child_process'),
	fs = rek('fs'),
	errors = rek('errors');

var actions = {
	'pause' : 'p',
	'unpause' : 'p',
	'increaseVolume' : '+',
	'decreaseVolume' : '-',
	'stop' : 'q'
};

var PAUSED = 'paused',
	STOPPED = 'stopped',
	PLAYING = 'playing';

var pipe = '/ramdisk/omxplayer';


function OmxPlayer() {
	this._volume = 0.9;
	this._state = STOPPED;
}

OmxPlayer.prototype.play = function(track) {
	if (this._state === PLAYING || this._state === PAUSED) {
		this._doAction('stop');
	}
	this._preparePipe();
	var trackPath = track.getResourcePath();
	this._exec('omxplayer ' + trackPath + ' < ' + pipe, function(err, stdout, stderr) {
		console.log('err: ' + err);
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
	});
	this._exec('echo . > ' + pipe);
	this._state = PLAYING;
	console.log('playing track ' + trackPath);
};

OmxPlayer.prototype._preparePipe = function() {
	if (fs.existsSync(pipe)) {
		// flush pipe
		this._exec('dd if=' + pipe + ' iflag=nonblock of=/dev/null');
	} else {
		this._exec('mkfifo ' + pipe);
	}
};

OmxPlayer.prototype.pause = function() {
	if (!this.canPause()) {
		throw errors.invalidState('Cannot pause player. Player is not playing.');
	}
	this._doAction('pause');
	this._state = PAUSED;
};

OmxPlayer.prototype.canPause = function() {
	return this._state === PLAYING;
};

OmxPlayer.prototype.unpause = function() {
	if (!this.canUnpause()) {
		throw errors.invalidState('Cannot unpause player. Player is not paused');
	}
	this._doAction('unpause');
	this._state = PLAYING;
};

OmxPlayer.prototype.canUnpause = function() {
	return this._state === PAUSED;
};

OmxPlayer.prototype.stop = function() {
	if (!this.canStop()) {
		throw errors.invalidState('Cannot stop player. Player is already stopped');
	}
	this._doAction('stop');
	this._state = STOPPED;
};

OmxPlayer.prototype.canStop = function() {
	return this._state !== STOPPED;
};

OmxPlayer.prototype.setVolume = function(value) {
	if (this._state == STOPPED) {
		throw new Error('Cannot set volume, player is stopped');
	}

	assert(value);
	if (value < 0) value = 0;
	if (value > 1) value = 1;

	var difference = value - this._volume;
	var stepSize = 0.05;
	var stepsToDo = Math.floor(Math.abs(difference / stepSize));
	console.log('stepsToDo: ' + stepsToDo)
	var volumeChangePerStep = stepSize * Math.sign(difference);
	for (var i = 0; i < stepsToDo; i++) {
		this._volume += volumeChangePerStep;
		if (volumeChangePerStep > 0) {
			this._doAction('increaseVolume');
		} else {
			this._doAction('decreaseVolume');
		}
	}
	console.log('volume changed to ' + this._volume)
};

OmxPlayer.prototype.getVolume = function() {
	return this._volume;
};

OmxPlayer.prototype.getState = function() {
	return this._state;
};

OmxPlayer.prototype._doAction = function(action) {
	var key = actions[action];
	assert(key);
	this._exec('echo -n ' + key + ' > ' + pipe);
	console.log('finished action ' + action);
};

OmxPlayer.prototype._exec = function(cmd, cb) {
	cp.exec(cmd, cb);
	console.log('executed: ' + cmd)
};

module.exports = OmxPlayer;