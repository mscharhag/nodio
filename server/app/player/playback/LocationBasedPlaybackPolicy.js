'use strict';

function LocationBasedPlaybackPolicy(shuffle, repeat) {
	this._repeat = repeat || false;
	this._shuffle = shuffle || false;
	this._shuffledTracks = null;
}

LocationBasedPlaybackPolicy.prototype.isRepeating = function() {
	return this._repeat;
};

LocationBasedPlaybackPolicy.prototype.isShuffling = function() {
	return this._shuffle;
};

LocationBasedPlaybackPolicy.prototype.getNextTrack = function(track) {
	if (this.isShuffling()) {
		return this._getNextShuffledTrack(track);
	}
	return this._getNextNonShuffledTrack(track);
};

LocationBasedPlaybackPolicy.prototype._getNextShuffledTrack = function(track) {
	var tracks = track.getLocation().getTracks();
	if (tracks.length === 1) {
		if (this.isRepeating()) {
			return tracks[0];
		}
		return null;
	}
	if (!this._shuffledTracks) {
		this._shuffledTracks = this._createShuffledTrackList(track);
		return this._shuffledTracks[0];
	}
	if (this._hasNextTrack(this._shuffledTracks, track)) {
		return this._getNextTrack(this._shuffledTracks, track);
	}
	if (!this.isRepeating()) {
		return null;
	}
	this._shuffledTracks = _.shuffle(tracks);
	return this._shuffledTracks[0];
};

LocationBasedPlaybackPolicy.prototype._getNextNonShuffledTrack = function(track) {
	var tracks = track.getLocation().getTracks();
	if (this._hasNextTrack(tracks, track)) {
		return this._getNextTrack(tracks, track);
	}
	if (!this.isRepeating()) {
		return null;
	}
	return tracks[0];
};

LocationBasedPlaybackPolicy.prototype._hasNextTrack = function(trackList, track) {
	var trackIndex = _.indexOf(trackList, track);
	assert(trackIndex >= 0);
	return trackIndex !== trackList.length - 1;
};

LocationBasedPlaybackPolicy.prototype._getNextTrack = function(trackList, track) {
	var trackIndex = _.indexOf(trackList, track);
	assert(trackIndex >= 0);
	return trackList[trackIndex + 1];
};

LocationBasedPlaybackPolicy.prototype._createShuffledTrackList = function(track) {
	return _.chain(track.getLocation().getTracks())
		.filter(function(element) { return element !== track })
		.shuffle()
		.value();
};

module.exports = LocationBasedPlaybackPolicy;