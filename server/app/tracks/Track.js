'use strict';

exports.Track = Track;

function Track(file) {
	this._name = file;
	this._length = 0;
	this._location = null;
}

Track.prototype.getName = function() {
	return this._name;
}


Track.prototype.getPath = function() {
	return this._location.getPath() + '/' + this.getName();
}

Track.prototype.getFullPath = function() {
	return this._location.getFullPath() + '/' + this.getName();
}


//ScannedFile.prototype.getExtension = function() {
//	var ext = path.extname(this._file)
//	return ext.substring(1).toLowerCase();
//}
//
//ScannedFile.prototype.getPath = function() {
//	return this._file.substring(0, this._file.lastIndexOf('/'));
//}
//
//ScannedFile.prototype.getName = function() {
//	return path.basename(this._file, path.extname(this._file))
//}

module.exports = Track;


