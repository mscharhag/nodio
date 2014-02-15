'use strict';

var convert = rek('converter');

module.exports = function() {
	return function(req, res, next) {
		res.dto = function(obj) {
			res.json(convert(obj));
		}
		next();
	}
}