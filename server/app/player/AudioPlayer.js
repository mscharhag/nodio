'use strict';

var Speaker = rek('speaker'),
	fs = rek('fs'),
	lame = rek('lame');

function AudioPlayer() {

}

AudioPlayer.prototype.play = function(track) {
	var trackPath = track.getFullPath();
	if (!fs.existsSync(trackPath)) {
		throw 'error, file does not exists' // TODO: improve error handling
	}

	var fileStream = fs.createReadStream(trackPath);
	var decoder = new lame.Decoder();

	var decodedStream = fileStream.pipe(decoder)
		.on('format', function(format) {
			console.log('format: ', format);
			decodedStream.pipe(new Speaker(format));
		});

	decodedStream.on('error', function(err) {
		console.log('stream error ' + err, err)
	});

}

module.exports = AudioPlayer;