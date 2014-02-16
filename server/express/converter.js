'use strict';

var mapping = {};

mapping.Location = function(location) {
	return {
		name : location.getName(),
		locations : _.map(location.getSubLocations(), function(subLocation) {
			return {
				name : subLocation.getName(),
				links : {
					self : '/locations' + subLocation.getPath()
				}
			}
		}),
		tracks : _.map(location.getTracks(), mapping.Track),
		links : {
			self : '/locations' + location.getPath()
		}
	}
}

mapping.Track = function(track) {
	return {
		name : track.getName(),
		links : {
			// TODO: add self link..
			play : '/player?track=' + track.getPath()
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