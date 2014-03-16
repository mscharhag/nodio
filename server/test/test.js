'use strict';

var Track = rek('Track'),
	TrackLocation = rek('TrackLocation');

exports.track = function(path) {
	var parts = path.split('/');
	var parent = null;
	var track = null;
	for (var i = 0; i < parts.length; i++) {
		if (!parts[i]) {
			continue;
		}
		if (i === parts.length - 1) {
			track = new Track(parent, parts[i]);
		} else {
			var resourcePath = path.substring(0, path.lastIndexOf('/'));
			parent = new TrackLocation(parent, parts[i], resourcePath);
		}
	}
	return track;
}