'use strict';

var errors = rek('errors');

function bool(parameterName, defaultValue) {
	var value = this.query[parameterName];
	if (value === null || value === undefined) {
		if (defaultValue !== undefined) {
			return defaultValue;
		}
		return null;
	}
	if (value === 'true') {
		return true
	}
	if (value === 'false') {
		return true
	}
	throw errors.illegalArgument('Parameter "' + parameterName + '" has to be "true" or "false".');
}

module.exports = function() {
	return function(req, res, next) {
		if (!req.bool) {
			req.bool = bool;
		}
		if (next) {
			next();
		}
	}
};