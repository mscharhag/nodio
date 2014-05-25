'use strict';

var app = rek('app'),
	errors = rek('errors');


exports.getStatus = function(req, res) {
	res.dto(app.audioPlayer);
};


exports.updateStatus = function(req, res) {
	performActionIfProvided(req, res);
	updateVolumeIfProvided(req, res);
	res.json({success: true});
};


function performActionIfProvided(req, res) {
	var action = req.query.action;
	if (!action) {
		return;
	}
	if (action === 'play') {
		playTrack(req, res);
	} else if (action === 'pause') {
		app.audioPlayer.pause();
	} else if (action === 'unpause') {
		app.audioPlayer.unpause();
	} else if (action === 'stop') {
		app.audioPlayer.stop();
	} else {
		throw errors.illegalArgument('"' + action + '" is not a valid action')
	}
}

function updateVolumeIfProvided(req, res) {
	var volume = req.query.volume;
	if (!volume) {
		return;
	}
	if (isNaN(volume)) {
		throw errors.illegalArgument('Volume has to be a number')
	}
	app.audioPlayer.setVolume(parseInt(volume));
}

function playTrack(req, res) {
	var trackPath = req.query.track;
	if (!trackPath) {
		throw errors.illegalArgument('Parameter "track" is required for action "play"');
	}
	var track = app.trackRepository.getTrack(trackPath);
	if (!track) {
		throw errors.trackNotFound(trackPath)
	}
	app.audioPlayer.play(track);
}