'use strict';

function TrackRepository(trackScanner) {
	this._trackScanner = trackScanner;
	this._locations = null;
}


TrackRepository.prototype.getLocations = function() {
	if (!this._locations) {
		this._locations = this._trackScanner.getLocations('test/files/');
	}
	return this._locations;
}


module.exports = TrackRepository;