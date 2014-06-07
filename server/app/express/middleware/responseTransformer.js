'use strict';

module.exports = function(corsDomains) {
	corsDomains = corsDomains || [];

	return function(req, res, next) {
		res.contentType('application/json');

		if (corsDomains.length > 0) {
			res.header('Access-Control-Allow-Methods', 'POST, GET');
			res.header('Access-Control-Allow-Origin', corsDomains);
		}

		if (next) {
			next();
		}
	}
};