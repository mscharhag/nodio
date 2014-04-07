'use strict';
var app = require('../../../app/app.js');

var tracks = rek('express/controller/tracks.js'),
	TrackLocation = rek('TrackLocation');

describe('tracks tests', function() {

	var trackRepository = app.trackRepository;

	afterEach(function() {
		app.trackRepository = trackRepository;
	})

	it('should pass a valid location path to the repository', function() {
		var locationPath
		app.trackRepository = {
			findLocation : function(path) {
				locationPath = path;
				return new TrackLocation();
			}
		}
		var res = { dto: function() {} }

		tracks.locations({ url: '/locations' }, res);
		expect(locationPath).toEqual('/');

	});

});
