'use strict';

var app = rek('app'),
	LocationBasedPlaybackPolicy = rek('LocationBasedPlaybackPolicy'),
	TrackBasedPlaybackPolicy = rek('TrackBasedPlaybackPolicy'),
	errors = rek('errors');


exports.getStatus = function(req, res) {
	res.dto(app.audioPlayer);
};


exports.updateStatus = function(req, res) {
	performActionIfProvided(req, res);
	updateVolumeIfProvided(req, res);
	updatePlaybackPolicyIfProvided(req, res);
	exports.getStatus(req, res);
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

function updatePlaybackPolicyIfProvided(req, res) {
	var type = req.query['playback-type'];
	var isRepeating = req.query['playback-isRepeating'];
	var isShuffling = req.query['playback-isShuffling'];

	if (!type && isRepeating === undefined && isShuffling === undefined) {
		return;
	}

	app.audioPlayer.setPlaybackPolicy(createNewPlaybackPolicy(req, res));
}

function createNewPlaybackPolicy(req, res) {
	var type = req.query['playback-type'];
	var repeat = req.bool('playback-isRepeating', true);
	var shuffle = req.bool('playback-isShuffling', false);

	if (type === 'location') {
		return new LocationBasedPlaybackPolicy(shuffle, repeat);
	}
	if (type === 'track') {
		if (req.query['playback-isShuffling']) {
			throw errors.illegalArgument('Parameter "playback-isShuffling" is not allowed if "playback-type" is "track"');
		}
		return new TrackBasedPlaybackPolicy(repeat);
	}
	throw errors.illegalArgument('Parameter "playback-type" has to be "location" or "track".');
}