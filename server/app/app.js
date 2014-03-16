
var app = module.exports = {};

global.rek = require('rekuire');
global._ = rek('lodash');
global.assert = rek('assert');


var TrackScanner = rek('TrackScanner'),
	TrackRepository = rek('TrackRepository'),
	OmxPlayer = rek('OmxPlayer'),
	config = rek('config');


process.on('uncaughtException',function(e) {
	console.log("Caught unhandled exception: " + e);
	console.log(" ---> : " + e.stack);
});

if (!_.endsWith) {
	_.endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
}

if (!_.startsWith) {
	_.startsWith = function (str, prefix) {
		return str.slice(0, prefix.length) == prefix;
	};
}

if (!Math.sign) {
	Math.sign = function(value) {
		if (value > 0) return 1
		if (value < 0) return -1
		return 0
	}
}

app.config = config;
app.trackScanner = new TrackScanner();
app.trackRepository = new TrackRepository(app.trackScanner);
app.audioPlayer = new OmxPlayer();

app.audioPlayer._exec = function(cmd, cb) {
	console.log('exec: ' + cmd);
}

console.log('app.js complete')