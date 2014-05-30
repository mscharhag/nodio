
module.exports = function() {
	return function(req, res, next) {
		res.contentType('application/json');
		if (next) {
			next();
		}
	}
};