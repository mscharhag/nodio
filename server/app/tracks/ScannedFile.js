'use strict';

var path = require('path');

function ScannedFile(file) {
	this._file = file;
}

ScannedFile.prototype.getExtension = function() {
	var ext = path.extname(this._file)
	return ext.substring(1).toLowerCase();
}

ScannedFile.prototype.getPath = function() {
	return this._file.substring(0, this._file.lastIndexOf('/'));
}

ScannedFile.prototype.getName = function() {
	return path.basename(this._file, path.extname(this._file))
}

ScannedFile.prototype.isAudioFile = function() {
	return _.contains(['mp3', 'ogg'], this.getExtension());
}

module.exports = ScannedFile;
