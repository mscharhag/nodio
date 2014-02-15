'use strict';

// TODO: cyclic links?

var fs = rek('fs'),
	Track = rek('Track'),
	Location = rek('Location'),
	path = rek('path');

function TrackScanner() {
	this.foo = ''
}

TrackScanner.prototype._listFiles = function(directory, onComplete) {
	this._scanDirectory(directory, '', {}, onComplete);
}

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


TrackScanner.prototype._createLocation = function(path) {
	var location = new Location();
	return location;
};

TrackScanner.prototype._createLocations = function(directory) {
	var subLocations = _.map(directory.directories, function(dir) {
		return this._createLocations(dir)
	}, this);
	var tracks = _.map(directory.files, function(file) {
		return this._createTrack(file)
	}, this);
	return new Location(directory.path, subLocations, tracks)
}

TrackScanner.prototype._createTrack = function(file) {
	return new Track(file);
}

TrackScanner.prototype.getLocations = function(directory) {
	var directoryStructure = this._scanDirectory(directory);
	return this._createLocations(directoryStructure);
}

module.exports = TrackScanner;
