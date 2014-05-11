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
};


beforeEach(function() {

	this.addMatchers({
		toFail: function(code, message) {
			var error;
			try {
				this.actual();
			} catch (e) {
				error = e;
			}
			if (!error) {
				return false;
			}
			this.message = function() {
				if (!error) {
					return 'No exception was thrown'
				}
				return 'expected code ' + code + ' and message "' + message + '", but got code '
						+ error.code + ' and message "' + error.message + '"';
			};
			return error.code === code && error.message === message;
		}
	});
});