'use strict';
var app = require('../../../app/app.js');

var player = rek('routes/player.js');

describe('player tests', function() {

	var audioPlayer = app.audioPlayer;
	var calls;
	var json;
	var res;

	beforeEach(function() {
		calls = [];
		// TODO: use jasmine spy?
		app.audioPlayer = {
			play : function(track) { calls.push({action: 'play', track: track}); },
			pause : function() { calls.push({ action: 'pause'}); },
			stop : function() { calls.push({ action: 'stop'}); }
		}
		res = {
			json : function(obj) {
				json = obj;
			}
		}
	});

	afterEach(function() {
		app.audioPlayer = audioPlayer;
	})

//	it('play a track', function() {
//		var json;
//		var res = {
//			json: function(obj) {
//				json = obj;
//			}
//		}
//		var req = {
//			query : {
//				action : 'play',
//				track : '/foo/bar/baz.mp3'
//			}
//		}
//
//		player.setStatus(req, res);
//		expect(locationPath).toEqual('/');
//
//	});


	it('should pause the player', function() {
		var req = {
			query : { action : 'pause' }
		}
		player.setStatus(req, res);
		expect(_.isEqual(calls, [{action: 'pause'}])).toBeTruthy();
		expect(_.isEqual(json, {success: true}));
	});

	it('should stop the player', function() {
		var req = {
			query: { action: 'stop' }
		}
		player.setStatus(req, res);
		expect(_.isEqual(calls, [{action: 'stop'}])).toBeTruthy();
		expect(_.isEqual(json, {success: true}));
	})

});
