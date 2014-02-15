'use strict';

exports.Track = Track;

function Track(file) {
	this._name = file;
	this._length = 0;
}

Track.prototype.getName = function() {
	return this._name;
}

module.exports = Track;


