
var app = module.exports = {};

global.rek = require('rekuire');
global._ = rek('lodash');


var TrackScanner = rek('TrackScanner'),
	TrackRepository = rek('TrackRepository');


process.on('uncaughtException',function(e) {
	console.log("Caught unhandled exception: " + e);
	console.log(" ---> : " + e.stack);
});

if (!_.endsWith) {
	_.endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
}

app.trackScanner = new TrackScanner();
app.trackRepository = new TrackRepository(app.trackScanner);

console.log('app.js complete')