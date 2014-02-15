'use strict';

var app = rek('app');

exports.list = function(req, res) {
	var locationPath = req.url.substring(req.url.indexOf('/', 1) + 1);
	if (_.endsWith(locationPath, '/')) {
		locationPath = locationPath.substring(0, locationPath.length - 1);
	}
	var location = app.trackRepository.getLocation(locationPath);
	res.dto(location);
}