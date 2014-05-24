'use strict';

var app = rek('app'),
	links = rek('LinkBuilder');

var locationsUrl = app.config.locationsUrl;
var playerUrl = app.config.playerUrl;

var map = {};

exports.simpleTrackLocation = function(location) {
	return {
		name: location.getName(),
		links: links(locationsUrl)
			.self(location.getPath())
			.build()
	}
};

exports.simpleTrack = function(track) {
	return {
		name : track.getName(),
		links : links() // TODO: add self link..
			.add('play', playerUrl + '?action=play&track=' + track.getPath())
			.build()
	}
};

exports.fullLocationBasedPlaybackPolicy = function(policy) {
	return {
		type : 'location',
		isRepeating : policy.isRepeating(),
		isShuffling : policy.isShuffling()
	}
};

exports.fullTrackBasedPlaybackPolicy = function(policy) {
	return {
		type : 'track',
		isRepeating : policy.isRepeating()
	}
};

exports.fullPlaybackPolicy = function(policy) {
	if (policy.constructor.name === 'LocationBasedPlaybackPolicy') {
		return exports.fullLocationBasedPlaybackPolicy(policy);
	}
	if (policy.constructor.name === 'TrackBasedPlaybackPolicy') {
		return exports.fullTrackBasedPlaybackPolicy(policy);
	}
	return null;
};

exports.fullTrackLocation = function(location) {
	return {
		name : location.getName(),
		locations : _.map(location.getLocations(), exports.simpleTrackLocation),
		tracks : _.map(location.getTracks(), exports.simpleTrack),
		links : links(locationsUrl)
			.self(location.getPath())
			.addWhen(location.getParent(), 'parent', function() {
				return location.getParent().getPath()
			})
			.build()
	}
};

exports.fullOmxPlayer = function(player) {
	var track = player.getCurrentTrack();
	return {
		state : player.getState(),
		volume : player.getVolume(),
		playbackPolicy : exports.fullPlaybackPolicy(player.getPlaybackPolicy()),
		currentTrack : track ? exports.simpleTrack(track) : null,
		links : links('/player')
			.self()
			.addWhen(player.canPause(), 'pause', '?action=pause')
			.addWhen(player.canUnpause(), 'unpause', '?action=unpause')
			.addWhen(player.canStop(), 'stop', '?action=stop')
			.build()
	}
};
