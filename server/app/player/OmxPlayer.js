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
	this._volume = 10; // ranges from 0 to 20
	this._state = STOPPED;
}

OmxPlayer.prototype.play = function(track) {
	if (this._state === PLAYING || this._state === PAUSED) {
		this._doAction('stop');
	}
	this._preparePipe();
	var trackPath = track.getResourcePath();
	var volume = '--vol ' + this._toMillibels(this._volume) + ' ';
	this._exec('omxplayer ' + volume + trackPath + ' < ' + pipe, function(err, stdout, stderr) {
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
	if (typeof value !== 'number' || value < 0 || value > 20) {
		throw errors.illegalArgument('Volume has to be a number between 0 and 20.')
	}
	var difference = Math.round(value) - this._volume;
	var step = Math.sign(difference);
	var stepsToDo = Math.abs(difference);
	for (var i = 0; i < stepsToDo; i++) {
		this._volume += step;
		if (step > 0) {
			this._doAction('increaseVolume');
		} else {
			this._doAction('decreaseVolume');
		}
	}
	console.log('volume changed to ' + this._volume);
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

OmxPlayer.prototype._toMillibels = function(value) {
	// 0 -> -6000mB
	// 20 -> 0mB
	assert(typeof value === 'number')
	var millibel = (value - 20) * 300;
	return Math.clamp(millibel, -6000, 0);
}

module.exports = OmxPlayer;