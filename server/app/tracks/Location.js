'use strict';

var path = rek('path');

function Location(path, locations, tracks) {
	assert(path, 'parameter path is required');
	this._parent = null;
	this._path = path;
	this._locations = locations || [];
	this._tracks = tracks || [];

	_.each(this._locations, function(subLocation) {
		assert(!subLocation._parent, 'sub location ' + subLocation.getName() + ' already has a parent');
		subLocation._parent = this;
	}, this);

	_.each(this._tracks, function(track) {
		// TODO: move this logic outside of location constructor and avoid private track._location access!
		assert(!track._location, 'track ' + track.getName() + ' already has a location');
		track._location = this;
	}, this)
}


Location.prototype.getName = function() {
	return path.basename(this._path);
}

Location.prototype.getPath = function() {
	if (!this._parent) {
		return '';
	}
	return this._parent.getPath() + '/' + this.getName();
}

Location.prototype.getFullPath =function () {
	return this._path;
}

Location.prototype.getSubLocations = function() {
	return this._locations
}

Location.prototype.getSubLocation = function(locationName) {
	return _.find(this._locations, function(location) {
		return location.getName() === locationName;
	});
}

Location.prototype.findSubLocation = function(locationPath) {
	var locationNames = locationPath.split('/');
	var location = this;
	for (var i = 0; i < locationNames.length && location; i++) {
		location = location.getSubLocation(locationNames[i]);
	}
	return location;
}

Location.prototype.findTrack = function(trackPath) {
	var locationPath = trackPath.substring(0, trackPath.lastIndexOf('/'));
	var trackName = trackPath.substring(trackPath.lastIndexOf('/') + 1);
	var location = this.findSubLocation(locationPath);
	return location.getTrack(trackName);
}

Location.prototype.getTrack = function(trackName) {
	return _.find(this._tracks, function(track) {
		return track.getName() === trackName;
	})
}


Location.prototype.getTracks = function() {
	return this._tracks;
}


module.exports = Location;