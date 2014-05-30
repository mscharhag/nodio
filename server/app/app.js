
var app = module.exports = {};

global.rek = require('rekuire');
global._ = rek('lodash');
global.assert = rek('assert');

rek('extensions');
rek('logging');

var TrackScanner = rek('TrackScanner'),
	TrackRepository = rek('TrackRepository'),
	OmxPlayer = rek('OmxPlayer'),
	config = rek('config');


process.on('uncaughtException',function(e) {
	console.log("Caught unhandled exception: " + e);
	console.log(" ---> : " + e.stack);
});



app.config = config;
app.trackScanner = new TrackScanner();
app.trackRepository = new TrackRepository(app.trackScanner);
app.audioPlayer = new OmxPlayer();

//app.audioPlayer._exec = function(cmd, cb) {
//	console.log('exec: ' + cmd);
//}
