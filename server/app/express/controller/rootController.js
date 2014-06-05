'use strict';

var app = rek('app'),
	links = rek('LinkBuilder');

var locationsUrl = app.config.locationsUrl;
var playerUrl = app.config.playerUrl;

exports.getStatus = function(req, res) {
	res.json({
		name: app.pkg.name,
		version: app.pkg.version,
		links: links()
			.self('/')
			.add('player', playerUrl)
			.add('locations', locationsUrl)
			.build()
	});
};