'use strict';
require('../../../app/app.js');

var Location = rek('Location'),
	Track = rek('Track');

describe('Location tests', function() {

	var trackA1 = new Track('track-A1');
	var trackA11 = new Track('track-A11');
	var trackA2 = new Track('track-A2');
	var track1 = new Track('track-1');

	var subSubLocationA1 = new Location('test/subA/subA-1', [], [trackA11]);
	var subSubLocationA2 = new Location('test/subA/subA-2');
	var subLocationA = new Location('/test/subA', [subSubLocationA1, subSubLocationA2], [trackA1, trackA2]);
	var subLocationB = new Location('/test/subB');
	var location = new Location('/test', [subLocationA, subLocationB], [track1]);

	it('should return a list of sub locations', function() {
		expect(_.isEqual(location.getSubLocations(), [subLocationA, subLocationB])).toBeTruthy();
		expect(subLocationB.getSubLocations().length).toEqual(0);
	});

	it('should return the correct sub location', function() {
		expect(location.getSubLocation('subA')).toEqual(subLocationA);
		expect(location.getSubLocation('subB')).toEqual(subLocationB);
		expect(location.getSubLocation('doesNotExist')).toBeFalsy();
		expect(subLocationA.getSubLocation('subA-1')).toEqual(subSubLocationA1);
		expect(subLocationB.getSubLocation('doesNotExist')).toBeFalsy();
	});

	it('should find the correct sub location', function() {
		expect(location.findSubLocation('subA')).toEqual(subLocationA);
		expect(location.findSubLocation('subA/subA-1')).toEqual(subSubLocationA1);
		expect(location.findSubLocation('subA/subA-2')).toEqual(subSubLocationA2);
		expect(location.findSubLocation('subA/subA-3')).toBeFalsy();
		expect(location.findSubLocation('subB/subA-1')).toBeFalsy();
		expect(location.findSubLocation('subC/subA-1')).toBeFalsy();
	});

});
