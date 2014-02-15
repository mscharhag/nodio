var app = require('../../../app/app.js'),
	TrackScanner = rek('TrackScanner'),
	Location = rek('Location'),
	Track = rek('Track'),
	util = rek('util');

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
		var result = trackScanner._createLocations(testStruct);
		expectLocation(result, 'test/files', 'files');

		var locations = result.getLocations();
		expect(locations.length).toEqual(1);
		expectLocation(locations[0], 'test/files/tracks', 'tracks');

		var locationTracks = locations[0].getTracks();
		expect(locationTracks.length).toEqual(2)
		expectTrack(locationTracks[0], 'mp3-01.mp3')
		expectTrack(locationTracks[1], 'mp3-02.mp3')

		var subLocation = locations[0].getLocations();

		expect(subLocation.length).toEqual(1);
		expectLocation(subLocation[0], 'test/files/tracks/sub-folder', 'sub-folder')

		var subLocationTracks = subLocation[0].getTracks();
		expect(subLocationTracks.length).toEqual(2)
		expectTrack(subLocationTracks[0], 'sub-folder-mp3-01.mp3')
		expectTrack(subLocationTracks[1], 'sub-folder-ogg-01.ogg')
	});

	function expectLocation(location, path, name) {
		expect(location instanceof Location).toBeTruthy();
		expect(location.getPath()).toEqual(path);
		expect(location.getName()).toEqual(name);
	}

	function expectTrack(track, name) {
		expect(track instanceof Track).toBeTruthy();
		expect(track.getName()).toEqual(name);
	}

});