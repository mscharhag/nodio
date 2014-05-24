'use strict';

var app = rek('app'),
	errors = rek('errors');

function urlToLocationPath(url, prefix) {
	assert(url, 'Parameter "url" is required');
	if (prefix) {
		assert(_.startsWith(url, prefix));
		url = url.substring(url.indexOf(prefix) + prefix.length);
	}
	if (url === '') {
		return '/'
	}
	if (url.length > 1 && _.endsWith(url, '/')) {
		return url.substring(0, url.length - 1);
	}
	return url;
}

exports.getLocation = function(req, res) {
	var locationPath = urlToLocationPath(req.url, app.config.locationsUrl);
	var location = app.trackRepository.findLocation(locationPath);
	if (!location) {
		throw errors.locationNotFound(locationPath)
	}
	res.dto(location);
};