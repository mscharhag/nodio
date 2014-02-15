var app = require('../../../app/app.js'),
	ScannedFile = rek('ScannedFile');

describe('ScannedFile tests', function() {

	function sf(file) {
		return new ScannedFile(file);
	}
	
	it('should return the correct extension', function() {
		expect(sf('foo/bar.mp3').getExtension()).toEqual('mp3');
		expect(sf('foo/bar.MP3').getExtension()).toEqual('mp3');
		expect(sf('foo/bar.mp3.txt').getExtension()).toEqual('txt');
		expect(sf('foo/bar.').getExtension()).toEqual('');
		expect(sf('foo/bar').getExtension()).toEqual('');
	});
	
	it('should return true for audio tracks', function() {
		expect(sf('foo.mp3').isAudioFile()).toBeTruthy();
		expect(sf('foo.MP3').isAudioFile()).toBeTruthy();
		expect(sf('foo/bar.mp3').isAudioFile()).toBeTruthy();
		expect(sf('foo.ogg').isAudioFile()).toBeTruthy();
		expect(sf('test.mp4').isAudioFile()).toBeFalsy();
		expect(sf('test').isAudioFile()).toBeFalsy();
		expect(sf('foo.mp3.txt').isAudioFile()).toBeFalsy();
	});
	
	it('should return the correct file name', function() {
		expect(sf('foo/bar.mp3').getName()).toEqual('bar');
		expect(sf('foo/bar').getName()).toEqual('bar');
		expect(sf('foo/bar.').getName()).toEqual('bar');
		expect(sf('bar.mp3').getName()).toEqual('bar');
		expect(sf('foo/a b c.mp3').getName()).toEqual('a b c');
		expect(sf('foo/bar.baz.mp3').getName()).toEqual('bar.baz');
	});
	
	it('should return the correct path', function() {
		expect(sf('foo/bar.mp3').getPath()).toEqual('foo');
		expect(sf('foo/bar/baz.mp3').getPath()).toEqual('foo/bar');
		expect(sf('/foo/bar.mp3').getPath()).toEqual('/foo');
		expect(sf('foo/a b c/bar.mp3').getPath()).toEqual('foo/a b c');
	});	
});
