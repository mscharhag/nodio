'use strict';

var json = rek('json-mapping');

module.exports = function() {
	return function(req, res, next) {
		res.dto = function(obj) {
			res.json(mapToDto(obj));
		};
		next();
	}
};

function mapToDto(obj) {
	var type = typeof obj;
	assert(type == 'object', 'Can only convert objects, got ' + type);
	var mapping = {
		TrackLocation : json.fullTrackLocation,
		OmxPlayer : json.fullOmxPlayer
	};
	var className = obj.constructor.name;
	var conversionFunc = mapping[className];
	assert(conversionFunc, 'No conversion function found for ' + className);
	return conversionFunc(obj);
}