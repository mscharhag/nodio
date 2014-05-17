'use strict';
var app = rek('app'),
	LocationBasedPlaybackPolicy = rek('LocationBasedPlaybackPolicy'),
	links = rek('LinkBuilder');

var locationsUrl = app.config.locationsUrl;
var playerUrl = app.config.playerUrl;

var mapping = {};


function simpleTrackLocation(location) {
	return {
		name: location.getName(),
		links: links(locationsUrl)
			.self(location.getPath())
			.build()
	}
};

function simpleTrack(track) {
	return {
		name : track.getName(),
		links : links() // TODO: add self link..
			.add('play', playerUrl + '?action=play&track=' + track.getPath())
			.build()
	}
}


function playbackPolicy(policy) {
	var obj = {};
	if (policy.constructor.name === 'LocationBasedPlaybackPolicy') {
		obj.type = 'location';
		obj.isRepeating = policy.isRepeating();
		obj.isShuffling = policy.isShuffling();
	}
	return obj;
}

mapping.TrackLocation = function(location) {
	return {
		name : location.getName(),
		locations : _.map(location.getLocations(), simpleTrackLocation),
		tracks : _.map(location.getTracks(), simpleTrack),
		links : links(locationsUrl)
			.self(location.getPath())
			.addWhen(location.getParent(), 'parent', function() {
				return location.getParent().getPath()
			})
			.build()
	}
};

mapping.OmxPlayer = function(player) {
	var track = player.getCurrentTrack();
	return {
		state : player.getState(),
		volume : player.getVolume(),
		playbackPolicy : playbackPolicy(player.getPlaybackPolicy()),
		currentTrack : track ? simpleTrack(track) : null,
		links : links('/player')
			.self()
			.addWhen(player.canPause(), 'pause', '?action=pause')
			.addWhen(player.canUnpause(), 'unpause', '?action=unpause')
			.addWhen(player.canStop(), 'stop', '?action=stop')
			.build()
	}
};

module.exports = function(obj) {
	var type = typeof obj;
	assert(type == 'object', 'Can only convert objects, got ' + type);

	var className = obj.constructor.name
	var conversionFunc = mapping[className];
	assert(conversionFunc, 'No conversion function found for ' + className);
	return conversionFunc(obj);
};