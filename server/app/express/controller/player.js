'use strict';

var app = rek('app'),
	errors = rek('errors');


exports.play = function(req, res) {
	var path = req.query.track.substring(1);
	var track = app.trackRepository.getTrack(path);
	app.audioPlayer.play(track);
	res.json({success: true});
}


exports.setStatus = function(req, res) {
	var action = req.query.action;
	if (action === 'play') {
		play(req, res);
	} else if (action === 'pause') {
		pause(req, res);
	} else if (action === 'unpause') {
		unpause(req, res);
	} else if (action === 'stop') {
		stop(req, res);
	}

	var volume = req.query.volume;
	if (volume) {
		if (isNaN(volume)) {
			throw errors.illegalArgument('Volume has to be a number')
		}
		app.audioPlayer.setVolume(parseInt(volume));
	}
	res.json({success: true});
//	getStatus(req, res);
}

var getStatus = exports.getStatus = function(req, res) {
	res.dto(app.audioPlayer);
};


var play = exports.play = function(req, res) {
	if (!req.query.track) {
		throw errors.illegalArgument('Parameter "track" is required for action "play"');
	}
	var track = app.trackRepository.getTrack(req.query.track);
	if (!track) {
		throw errors.trackNotFound(req.query.track)
	}
	app.audioPlayer.play(track);
}

var pause = exports.pause = function(req, res) {
	app.audioPlayer.pause();
}

var unpause = exports.pause = function(req, res) {
	app.audioPlayer.unpause();
}

var stop = exports.stop = function(req, res) {
	app.audioPlayer.stop();
}