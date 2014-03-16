'use strict';

var errors = rek('errors');

module.exports = function() {
	return function(err, req, res, next) {
		if (err) {
			console.log('err: ' + err.stack)
			if (err instanceof errors.Error) {
				res.json({code: err.code, message: err.message})
			} else {
				res.json({code: 1337, message: 'unknown'})
			}
		}

	}
}