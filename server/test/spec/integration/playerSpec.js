'use strict';
require('../../../app/express/express-setup.js');
var app = rek('app'),
	OmxPlayer = rek('OmxPlayer'),
	OmxPlayerCli = rek('OmxPlayerCli'),
	request = require('supertest');

describe('integration tests for /player', function() {

	beforeEach(function() {
		app.audioPlayer = new OmxPlayer();
		spyOn(OmxPlayerCli, 'execute');
	});

	it('should respond with the current player state', function(done) {
		request(app.server)
			.get('/player')
			.expect('Content-Type', /json/)
			.expect(200, {
				"state": "stopped",
				"volume": 10,
				"playbackPolicy": {
					"type": "location",
					"isRepeating": false,
					"isShuffling": false
				},
				"currentTrack": null,
				"links": { "self": "/player" }
			}, done)
	});


	it('should start playing a track', function(done) {
		request(app.server)
			.post('/player?action=play&track=/files/tracks/mp3-01.mp3')
			.expect('Content-Type', /json/)
			.expect(200, {
				"state": "playing",
				"volume": 10,
				"currentTrack" : {
					name: 'mp3-01.mp3',
					links: { play: '/player?action=play&track=/files/tracks/mp3-01.mp3' }
				},
				"playbackPolicy": {
					"type": "location",
					"isRepeating": false,
					"isShuffling": false
				},
				"links": {
					self: '/player',
					pause: '/player?action=pause',
					stop: '/player?action=stop'
				}
			}, done)
	});


	it('should respond with 404 if an invalid track is passed', function(done) {
		request(app.server)
			.post('/player?action=play&track=/foo.mp3')
			.expect('Content-Type', /json/)
			.expect(404, {
				code: 1011,
				message: 'Track "/foo.mp3" not found'
			}, done)
	});
});
