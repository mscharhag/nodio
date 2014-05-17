'use strict';

// TODO: add test?

function TrackBasedPlaybackPolicy(repeat) {
	this._repeat = repeat || false;
}

TrackBasedPlaybackPolicy.prototype.isRepeating = function() {
	return this._repeat;
};

TrackBasedPlaybackPolicy.prototype.getNextTrack = function(track) {
	if (this.isRepeating()) {
		return track;
	}
	return null;
};

module.exports = TrackBasedPlaybackPolicy;