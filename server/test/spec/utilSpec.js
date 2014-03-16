'use strict';
var app = require('../../app/app.js');

var util = rek('util');

describe('util tests', function() {

	it('TODO', function() {
		expect(util.urlToLocationPath('/locations', '/locations')).toEqual('/');
		expect(util.urlToLocationPath('/locations/', '/locations')).toEqual('/');
		expect(util.urlToLocationPath('/locations/foo', '/locations')).toEqual('/foo');
		expect(util.urlToLocationPath('/locations/foo/', '/locations')).toEqual('/foo');
	});

});
