'use strict';

var app = rek('app');


exports.play = function(req, res) {
	var path = req.query.track.substring(1);
	var track = app.trackRepository.getTrack(path);
	app.audioPlayer.play(track);
	res.json({success: true});
}