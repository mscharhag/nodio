'use strict';
var app = require('../../app/app.js');

describe('extension method tests', function() {

	it('startsWith', function() {
		expect(_.startsWith('foo', 'fo')).toBeTruthy();
		expect(_.startsWith('foo', 'foo')).toBeTruthy();
		expect(_.startsWith('foo', 'fooo')).toBeFalsy();
		expect(_.startsWith('foo', 'bar')).toBeFalsy();
	});

	it('endsWith', function() {
		expect(_.endsWith('foo', 'oo')).toBeTruthy();
		expect(_.endsWith('foo', 'foo')).toBeTruthy();
		expect(_.endsWith('foo', 'fooo')).toBeFalsy();
		expect(_.endsWith('foo', 'bar')).toBeFalsy();
	});

	it('should return the correct sign', function() {
		expect(Math.sign(5)).toEqual(1);
		expect(Math.sign(-5)).toEqual(-1);
		expect(Math.sign(0)).toEqual(0);
	});

	it('should clamp to the correct value', function() {
		expect(Math.clamp(10, 5, 15)).toEqual(10);
		expect(Math.clamp(10, 0, 5)).toEqual(5);
		expect(Math.clamp(10, 15, 20)).toEqual(15);
	});

});
