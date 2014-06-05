'use strict';
require('../../../app/express/express-setup.js');

var app = rek('app'),
	request = require('supertest');

describe('integration tests for /locations/** urls', function() {

	it('should respond with the base location', function(done) {
		request(app.server)
			.get('/locations')
			.expect('Content-Type', /json/)
			.expect(200, {
				"name": null,
				"locations": [{
					"name": "files",
					"links": { "self": "/locations/files" }
				}],
				"tracks": [],
				"links": { "self": "/locations" }
			}, done)
	});
});
