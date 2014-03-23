function NodioError(code, msg) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.code = code;
	this.message = msg;
	this.name = 'NodioError';
};

NodioError.prototype.__proto__ = Error.prototype;

exports.Error = NodioError;

exports.trackNotFound = function(trackPath) {
	var message = 'Track ' + (trackPath ? '"' + trackPath + '" ' : '') + 'not found';
	return new NodioError(1001, message);
}

exports.locationNotFound = function(locationPath) {
	var message = 'Location ' + (locationPath ? '"' + locationPath + '" ' : '') + 'not found';
	return new NodioError(1004, message);
}

exports.invalidState = function(message) {
	return new NodioError(1002, message);
}

exports.illegalArgument = function(message) {
	return new NodioError(1003, message);
}

