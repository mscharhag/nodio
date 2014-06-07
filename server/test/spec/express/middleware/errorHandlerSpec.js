'use strict';
var app = require('../../../../app/app.js');
var errorHandler = rek('errorHandler'),
	errors = rek('errors');

describe('errorHandler tests', function() {

	var handler, res;

	beforeEach(function() {
		handler = errorHandler();
		res = { json: jasmine.createSpy('json') }
	});

	function jsonForError(err) {
		handler(err, null, res);
		return res.json.argsForCall[0][1];
	}

	function statusCodeForError(err) {
		handler(err, null, res);
		return res.json.argsForCall[0][0];
	}

	it('should use error code and message from the error object', function() {
		expect(jsonForError(new errors.Error(1234, 'test error'))).toEqual({code: 1234, message: 'test error'});
	});

	it('should map TRACK_NOT_FOUND errors to status code 404', function() {
		expect(statusCodeForError(errors.trackNotFound())).toEqual(404);
	});

	it('should map LOCATION_NOT_FOUND errors to status code 404', function() {
		expect(statusCodeForError(errors.locationNotFound())).toEqual(404);
	});

	it('should map ILLEGAL_ARGUMENT errors to status code 400', function() {
		expect(statusCodeForError(errors.illegalArgument())).toEqual(400);
	});

	it('should map CODE_INVALID_STATE errors to status code 400', function() {
		expect(statusCodeForError(errors.invalidState())).toEqual(400);
	});

	it('should return status code 500 if an unknown error occurs', function() {
		expect(statusCodeForError({})).toEqual(500);
	});

	it('should return error code 1000 with an unknown error message if an unknown error occurs', function() {
		expect(jsonForError({})).toEqual({code: 1000, message: 'An unknown internal error occurred'});
	});
});
