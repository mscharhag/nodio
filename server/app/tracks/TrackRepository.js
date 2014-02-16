'use strict';

var Location = rek('Location');

function TrackRepository(trackScanner) {
	this._trackScanner = trackScanner;
	this._baseLocation = null;
	this._baseLocationPath = 'test/files';
}


TrackRepository.prototype.getLocation = function(locationPath) {
	var baseLocation = this._getBaseLocation();
	if (!locationPath) {
		return baseLocation;
	}
	var subLocation = baseLocation.findSubLocation(locationPath);
	return subLocation;
}

TrackRepository.prototype.getTrack = function(trackPath) {
	assert(trackPath, 'Parameter trackPath is required');
	return this._getBaseLocation().findTrack(trackPath);
}


TrackRepository.prototype._getBaseLocation = function() {
	if (!this._baseLocation) {
		var scannedLocation = this._trackScanner.getLocations(this._baseLocationPath);
		this._baseLocation = new Location('Locations', [scannedLocation]);
	}
	return this._baseLocation;
}

module.exports = TrackRepository;