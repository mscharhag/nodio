'use strict';

var app = rek('app'),
	util = rek('util');

exports.list = function(req, res) {
	var locationPath = util.urlToLocationPath(req.url, '/locations');
	console.log('path: ' + locationPath)
	var location = app.trackRepository.findLocation(locationPath);
	res.dto(location);
}