'use strict';

var path = rek('path');

function Location(path, locations, tracks) {
	this._path = path;
	this._locations = locations;
	this._tracks = tracks;
}


Location.prototype.getName = function() {
	return path.basename(this._path);
}

Location.prototype.getPath = function() {
	return this._path;
}

Location.prototype.getLocations = function() {
	return this._locations
}

Location.prototype.getTracks = function() {
	return this._tracks;
}

module.exports = Location;