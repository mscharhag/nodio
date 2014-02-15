'use strict';

var app = rek('app');

exports.list = function(req, res) {
	var locations = app.trackRepository.getLocations();
	res.json(locations);
}