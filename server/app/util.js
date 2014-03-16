'use strict';

exports.urlToLocationPath = function(url, prefix) {
	assert(url, 'Parameter "url" is required');
	if (prefix) {
		assert(_.startsWith(url, prefix))
		url = url.substring(url.indexOf(prefix) + prefix.length);
	}
	if (url === '') {
		return '/'
	}
	if (url.length > 1 && _.endsWith(url, '/')) {
		return url.substring(0, url.length - 1);
	}
	return url;
}