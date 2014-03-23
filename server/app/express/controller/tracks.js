'use strict';

var app = rek('app'),
	util = rek('util'),
	errors = rek('errors');

exports.locations = function(req, res) {
	var locationPath = util.urlToLocationPath(req.url, app.config.locationsUrl);
	console.log('path: ' + locationPath)
	var location = app.trackRepository.findLocation(locationPath);
	if (!location) {
		throw errors.locationNotFound(locationPath)
	}
	res.dto(location);
}