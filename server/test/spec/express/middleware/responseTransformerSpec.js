'use strict';
require('../../../test.js');

var responseTransformer = rek('responseTransformer');

describe('response middleware tests', function() {

	var res;

	beforeEach(function() {
		res = {
			contentType : jasmine.createSpy('contentType'),
			header : jasmine.createSpy('header')
		};
	});

	it('should add CORS header', function() {
		var rt = responseTransformer(['http://foobar.baz']);
		rt({}, res);
		expect(res.header.callCount).toEqual(2);
		expect(res.header.argsForCall[0]).toEqual(['Access-Control-Allow-Methods', 'POST, GET']);
		expect(res.header.argsForCall[1]).toEqual(['Access-Control-Allow-Origin', ['http://foobar.baz']]);
	});

	it('should add json content type', function() {
		var rt = responseTransformer();
		rt({}, res);
		expect(res.contentType).toHaveBeenCalledWith('application/json')
	});
});