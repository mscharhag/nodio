'use strict';

var errors = rek('errors');

var statusCodes = {};
statusCodes[errors.CODE_TRACK_NOT_FOUND] = 404;
statusCodes[errors.CODE_LOCATION_NOT_FOUND] = 404;
statusCodes[errors.CODE_ILLEGAL_ARGUMENT] = 400;
statusCodes[errors.CODE_INVALID_STATE] = 400;
statusCodes[errors.CODE_UNKNOWN] = 500;

module.exports = function() {
	return function(err, req, res, next) {
		if (err) {
			log.error('Error: ' + err.stack, err);
			var code = errors.CODE_UNKNOWN;
			var message = 'An unknown internal error occurred';
			if (err instanceof errors.Error) {
				code = err.code;
				message = err.message;
			}
			res.json(statusCodes[code], {
				code: code,
				message: message
			});
		}

	}
};