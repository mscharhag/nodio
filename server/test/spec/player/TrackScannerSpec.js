'use strict';

var app = require('../../../app/app.js'),
	TrackScanner = rek('TrackScanner'),
	TrackLocation = rek('TrackLocation'),
	Track = rek('Track');

describe('TrackScanner tests', function() {

	var trackScanner;
	var testFiles = 'test/files'

	var testStruct = {
		path : testFiles,
		files : [],
		directories : [{
			path : testFiles + '/tracks',
			directories : [{
				path : testFiles + '/tracks/sub-folder',
				directories : [],
				files : ['sub-folder-mp3-01.mp3', 'sub-folder-ogg-01.ogg']
			}],
			files : ['mp3-01.mp3', 'mp3-02.mp3']
		}]
	};
	
	beforeEach(function() {
		trackScanner = new TrackScanner();
	});

	it('should list all files', function() {
		var result = trackScanner._scanDirectory(testFiles);
		expect(_.isEqual(result, testStruct)).toBeTruthy();
	});
	
	it('should return true for audio tracks', function() {
		expect(trackScanner._isAudioFile('foo.mp3')).toBeTruthy();
		expect(trackScanner._isAudioFile('foo/bar.mp3')).toBeTruthy();
		expect(trackScanner._isAudioFile('foo.ogg')).toBeTruthy();
		expect(trackScanner._isAudioFile('test.mp4')).toBeFalsy();
		expect(trackScanner._isAudioFile('test')).toBeFalsy();
		expect(trackScanner._isAudioFile('foo.mp3.txt')).toBeFalsy();
	});

	it('should build a location structure', function() {
		var baseLocation = new TrackLocation();
		trackScanner._createLocations(testStruct, baseLocation);

		// /
		expect(baseLocation.getTracks().length).toEqual(0);
		var locations = baseLocation.getLocations();
		expect(locations.length).toEqual(1);

		// /files
		var location = locations[0];
		expectLocation(location, '/files', 'files');
		expectTracks(location, []);
		locations = location.getLocations();
		expect(locations.length).toEqual(1);

		// /files/tracks
		location = locations[0];
		expectLocation(location, '/files/tracks', 'tracks');
		expectTracks(location, ['mp3-01.mp3', 'mp3-02.mp3']);
		locations = location.getLocations();
		expect(locations.length).toEqual(1);

		// /files/tracks/sub-folder
		location = locations[0];
		expectLocation(location, '/files/tracks/sub-folder', 'sub-folder');
		expectTracks(location, ['sub-folder-mp3-01.mp3', 'sub-folder-ogg-01.ogg']);
		locations = location.getLocations();
		expect(locations.length).toEqual(0);
	});

	function expectLocation(location, path, name) {
		expect(location instanceof TrackLocation).toBeTruthy();
		expect(location.getPath()).toEqual(path);
		expect(location.getName()).toEqual(name);
	}

	function expectTracks(location, trackNames) {
		var tracks = location.getTracks();
		expect(tracks.length).toEqual(trackNames.length);
		_.each(tracks, function(track) {
			expect(track instanceof Track).toBeTruthy();
			expect(_.contains(trackNames, track.getName())).toBeTruthy();
		})
	}

});