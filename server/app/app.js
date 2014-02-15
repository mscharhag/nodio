process.on('uncaughtException',function(e) {
	console.log("Caught unhandled exception: " + e);
	console.log(" ---> : " + e.stack);
});

var app = {};

exports.app = app;

var _ = require('lodash');
var rek = require('rekuire');


if (!_.endsWith) {
	_.endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
}


global._ = _;
global.rek = rek;

console.log('app.js complete')