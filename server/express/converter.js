'use strict';
var app = rek('app');

var locationsUrl = app.config.locationsUrl;
var playerUrl = app.config.playerUrl;

var mapping = {};

mapping.TrackLocation = function(location) {
	return {
		name : location.getName(),
		locations : _.map(location.getLocations(), function(subLocation) {
			return {
				name : subLocation.getName(),
				links : {
					self : locationsUrl + subLocation.getPath()
				}
			}
		}),
		tracks : _.map(location.getTracks(), mapping.Track),
		links : {
			self : locationsUrl + location.getPath()
		}
	}
}

mapping.Track = function(track) {
	return {
		name : track.getName(),
		links : {
			// TODO: add self link..
			play : playerUrl + '?action=play&track=' + track.getPath()
		}
	}
}

module.exports = function(obj) {
	var type = typeof obj;
	assert(type == 'object', 'Can only convert objects, got ' + type);

	var className = obj.constructor.name
	var conversionFunc = mapping[className];
	assert(conversionFunc, 'No conversion function found for ' + className);
	return conversionFunc(obj);
}