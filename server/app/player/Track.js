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
}

Track.prototype.getPath = function() {
	var locationPath = this._location.getPath();
	if (locationPath === '/') {
		return locationPath + this.getName();
	}
	return locationPath + '/' + this.getName();
}

Track.prototype.getResourcePath = function() {
	return this._location.getResourcePath() + '/' + this.getName();
}

Track.prototype.getLocation = function() {
	return this._location;
}

module.exports = Track;