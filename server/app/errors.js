function NodioError(code, msg) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.code = code;
	this.message = msg;
	this.name = 'NodioError';
}

NodioError.prototype.__proto__ = Error.prototype;

exports.Error = NodioError;

exports.CODE_INVALID_STATE 		= 1001;
exports.CODE_ILLEGAL_ARGUMENT 	= 1002;
exports.CODE_TRACK_NOT_FOUND 	= 1011;
exports.CODE_LOCATION_NOT_FOUND = 1021;

exports.trackNotFound = function(trackPath) {
	var message = 'Track ' + (trackPath ? '"' + trackPath + '" ' : '') + 'not found';
	return new NodioError(exports.CODE_TRACK_NOT_FOUND, message);
};

exports.locationNotFound = function(locationPath) {
	var message = 'Location ' + (locationPath ? '"' + locationPath + '" ' : '') + 'not found';
	return new NodioError(exports.CODE_LOCATION_NOT_FOUND, message);
};

exports.invalidState = function(message) {
	return new NodioError(exports.CODE_INVALID_STATE, message);
};

exports.illegalArgument = function(message) {
	return new NodioError(exports.CODE_ILLEGAL_ARGUMENT, message);
};



