'use strict';

function LinkBuilder(baseUrl) {
	this._baseUrl = baseUrl || '';
	this._links = {};
}

LinkBuilder.prototype.self = function(url) {
	url = url || '';
	if (_.endsWith(url, '/')) {
		url = url.substring(0, url.lengths - 1);
	}
	this._links.self = this._baseUrl + url;
	return this;
};

LinkBuilder.prototype.add = function(name, url, options) {
	options = options || {};
	var urlPrefix = options.absolute ? '' : this._baseUrl;
	if (typeof url === 'function') {
		url = url();
	}
	if (_.endsWith(url, '/')) {
		url = url.substring(0, url.lengths - 1);
	}
	this._links[name] = urlPrefix + url;
	return this;
};

LinkBuilder.prototype.addWhen = function(condition, name, url, options) {
	if (!condition) {
		return this;
	}
	return this.add(name, url, options);
};

LinkBuilder.prototype.build = function() {
	return this._links;
};

module.exports = function(baseUrl) {
	return new LinkBuilder(baseUrl);
};