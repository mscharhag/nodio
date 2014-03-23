'use strict';

// TODO: cyclic links?

// file/directory name
// return path.basename(this._path);

var fs = rek('fs'),
	Track = rek('Track'),
	TrackLocation = rek('TrackLocation'),
	path = rek('path');

function TrackScanner() { }

TrackScanner.prototype._isAudioFile = function(file) {
	var extension = path.extname(file).substring(1).toLowerCase();
	return _.contains(['mp3', 'ogg'], extension);
}

TrackScanner.prototype._scanDirectory = function(directory) {
	var nodes = fs.readdirSync(directory);
	var info = {
		path : directory,
		files : [],
		directories : []
	};
	_.each(nodes, function(node) {
		var stats = fs.statSync(directory + '/' + node);
		if (stats.isFile() && this._isAudioFile(node)) {
			info.files.push(node);
		}
		if (stats.isDirectory()) {
			info.directories.push(this._scanDirectory(directory + '/' + node))
		}
	}, this);
	return info;	
}

TrackScanner.prototype._createLocations = function(directory, parent) {
	var location = new TrackLocation(parent, path.basename(directory.path), directory.path);
	_.map(directory.directories, function(directory) {
		return this._createLocations(directory, location)
	}, this);
	 _.map(directory.files, function(file) {
		return this._createTrack(file, location)
	}, this);
}

TrackScanner.prototype._createTrack = function(file, parent) {
	return new Track(parent, file);
}

TrackScanner.prototype.getLocations = function(directory) {
	assert(directory, 'directory is not defined')
	var directoryStructure = this._scanDirectory(directory);
	var baseLocation = new TrackLocation();
	this._createLocations(directoryStructure, baseLocation);
	return baseLocation;
}

module.exports = TrackScanner;
