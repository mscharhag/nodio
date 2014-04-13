'use strict';

exports.Track = Track;

function Track(location, filename) {
	assert(location && filename, 'Parameters "location" and "filename" are required.');
	this._filename = filename;
	this._location = location;
	this._location.addTrack(this);
}

Track.prototype.getName = function() {
	return this._filename;
};

Track.prototype.getPath = function() {
	var locationPath = this._location.getPath();
	if (locationPath === '/') {
		return locationPath + this.getName();
	}
	return locationPath + '/' + this.getName();
};

Track.prototype.getResourcePath = function() {
	return this._location.getResourcePath() + '/' + this.getName();
};

Track.prototype.getLocation = function() {
	return this._location;
};


Track.prototype.getNextTrack = function() {
	var trackIndex = this._getTrackIndex();
	if (trackIndex < this._location.getTracks().length - 1) {
		return this._location.getTracks()[trackIndex + 1];
	}
	return null;
};

Track.prototype.getPreviousTrack = function() {
	var trackIndex = this._getTrackIndex();
	if (trackIndex > 0) {
		return this._location.getTracks()[trackIndex - 1];
	}
	return null;
};

Track.prototype._getTrackIndex = function() {
	var index = _.findIndex(this._location.getTracks(), function(otherTrack) {
		return otherTrack === this;
	}, this);
	assert(index >= 0);
	return index;
};


module.exports = Track;