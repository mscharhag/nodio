'use strict';

var path = rek('path');

function TrackLocation(parent, name, resourcePath) {
	this._parent = parent || null;
	this._name = name || null;
	this._resourcePath = resourcePath || null;
	this._locations = [];
	this._tracks = [];
	if (this._parent) {
		this._parent.addLocation(this);
	}
}

TrackLocation.prototype.getParent = function() {
	return this._parent;
};

TrackLocation.prototype.getName = function() {
	return this._name;
};

TrackLocation.prototype.getPath = function() {
	if (!this._parent) {
		return '/';
	}
	var parentPath = this._parent.getPath();
	if (parentPath === '/') {
		return parentPath + this.getName();
	}
	return parentPath + '/' + this.getName();
};

TrackLocation.prototype.getResourcePath = function () {
	return this._resourcePath;
};

TrackLocation.prototype.getLocations = function() {
	return this._locations
};

TrackLocation.prototype.getTracks = function() {
	return this._tracks;
};

TrackLocation.prototype.addTrack = function(track) {
	this._tracks.push(track);
};

TrackLocation.prototype.addLocation = function(location) {
	this._locations.push(location);
};

TrackLocation.prototype.getLocation = function(locationName) {
	if (!locationName) {
		return null;
	}
	return _.find(this._locations, function(location) {
		return location.getName() === locationName;
	});
};

TrackLocation.prototype.findLocation = function(locationPath) {
	if (!locationPath) {
		return null;
	}
	if (locationPath === '/') {
		return this;
	}
	var locationNames = locationPath.split('/');
	if (locationNames.length > 0 && locationNames[0] === '') {
		locationNames.splice(0, 1);
	}
	var location = this;
	for (var i = 0; i < locationNames.length && location; i++) {
		location = location.getLocation(locationNames[i]);
	}
	return location;
};

TrackLocation.prototype.findTrack = function(trackPath) {
	if (!trackPath) {
		return null;
	}
	var locationPath = trackPath.substring(0, trackPath.lastIndexOf('/'));
	var trackName = trackPath.substring(trackPath.lastIndexOf('/') + 1);
	var location = this.findLocation(locationPath);
	return location ? location.getTrack(trackName) : null;
};

TrackLocation.prototype.getTrack = function(trackName) {
	if (!trackName) {
		return null;
	}
	return _.find(this._tracks, function(track) {
		return track.getName() === trackName;
	})
};




module.exports = TrackLocation;