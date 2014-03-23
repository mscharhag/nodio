'use strict';

var TrackLocation = rek('TrackLocation'),
	config = rek('config');

function TrackRepository(trackScanner) {
	this._trackScanner = trackScanner;
	this._baseLocation = null;
	this._baseLocationPath = config.trackDirectory;
}

TrackRepository.prototype.findLocation = function(locationPath) {
	var baseLocation = this._getBaseLocation();
	if (!locationPath || locationPath === '/') {
		return baseLocation;
	}
	return baseLocation.findLocation(locationPath);
}

TrackRepository.prototype.getTrack = function(trackPath) {
	assert(trackPath, 'Parameter trackPath is required');
	return this._getBaseLocation().findTrack(trackPath);
}

TrackRepository.prototype._getBaseLocation = function() {
	if (!this._baseLocation) {
		this._baseLocation = this._trackScanner.getLocations(this._baseLocationPath);
	}
	return this._baseLocation;
}

module.exports = TrackRepository;