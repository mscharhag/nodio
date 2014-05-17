'use strict';

var errors = rek('errors'),
	cli = rek('OmxPlayerCli'),
	LocationBasedPlaybackPolicy = rek('LocationBasedPlaybackPolicy');

var PAUSED = 'paused',
	STOPPED = 'stopped',
	PLAYING = 'playing';

function OmxPlayer() {
	this._volume = 10; // ranges from 0 to 20
	this._state = STOPPED;
	this._playbackPolicy = new LocationBasedPlaybackPolicy();
	this._currentTrack = null;
}

OmxPlayer.prototype.play = function(track) {
	if (this._state === PLAYING || this._state === PAUSED) {
		cli.stop();
	}
	this._state = PLAYING;
	cli.play(track.getResourcePath(), this._volume, _.bind(this._onPlaybackComplete, this));
	this._currentTrack = track;
	console.log('playing track ' + track.getResourcePath());
};

OmxPlayer.prototype._onPlaybackComplete = function(err, stdout, stderr) {
	var nextTrack = this._playbackPolicy.getNextTrack(this._currentTrack);
	console.log('next track: ', nextTrack);
	if (nextTrack) {
		this.play(nextTrack);
		return;
	}
	this._currentTrack = null; // TODO: test?
};

OmxPlayer.prototype.pause = function() {
	if (!this.canPause()) {
		throw errors.invalidState('Cannot pause player. Player is not playing.');
	}
	cli.pause();
	this._state = PAUSED;
};

OmxPlayer.prototype.canPause = function() {
	return this._state === PLAYING;
};

OmxPlayer.prototype.unpause = function() {
	if (!this.canUnpause()) {
		throw errors.invalidState('Cannot unpause player. Player is not paused');
	}
	cli.unpause();
	this._state = PLAYING;
};

OmxPlayer.prototype.canUnpause = function() {
	return this._state === PAUSED;
};

OmxPlayer.prototype.stop = function() {
	if (!this.canStop()) {
		throw errors.invalidState('Cannot stop player. Player is already stopped');
	}
	cli.stop();
	this._state = STOPPED;
};

OmxPlayer.prototype.canStop = function() {
	return this._state !== STOPPED;
};

OmxPlayer.prototype.setVolume = function(value) {
	if (typeof value !== 'number' || value < 0 || value > 20) {
		throw errors.illegalArgument('Volume has to be a number between 0 and 20.')
	}
	if (this._state === STOPPED) {
		this._volume = value;
		return;
	}
	var difference = Math.round(value) - this._volume;
	var step = Math.sign(difference);
	var stepsToDo = Math.abs(difference);
	for (var i = 0; i < stepsToDo; i++) {
		this._volume += step;
		if (step > 0) {
			cli.increaseVolume();
		} else {
			cli.decreaseVolume();
		}
	}
	console.log('volume changed to ' + this._volume);
};

OmxPlayer.prototype.setPlaybackPolicy = function(policy) {
	assert(policy && typeof policy.getNextTrack === 'function');
	this._playbackPolicy = policy;
};

OmxPlayer.prototype.getVolume = function() {
	return this._volume;
};

OmxPlayer.prototype.getState = function() {
	return this._state;
};

Omxplayer.prototype.getCurrentTrack = function() {
	return this._currentTrack;
};

module.exports = OmxPlayer;