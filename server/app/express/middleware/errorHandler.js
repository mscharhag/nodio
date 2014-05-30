'use strict';

var errors = rek('errors');

var statusCodes = {};
statusCodes[errors.CODE_TRACK_NOT_FOUND] = 404;
statusCodes[errors.CODE_LOCATION_NOT_FOUND] = 404;
statusCodes[errors.CODE_ILLEGAL_ARGUMENT] = 400;
statusCodes[errors.CODE_INVALID_STATE] = 400;

module.exports = function() {
	return function(err, req, res, next) {
		if (err) {
			console.log('err: ' + err.stack)
			if (err instanceof errors.Error) {
				var code = statusCodes[err.code];
				res.json(code, {code: err.code, message: err.message})
			} else {
				res.json({code: 1337, message: 'unknown'})
			}
		}

	}
};