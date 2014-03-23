if (!_.endsWith) {
	_.endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};
}

if (!_.startsWith) {
	_.startsWith = function (str, prefix) {
		return str.slice(0, prefix.length) == prefix;
	};
}

if (!Math.sign) {
	Math.sign = function(value) {
		if (value > 0) return 1
		if (value < 0) return -1
		return 0
	}
}

if (!Math.clamp) {
	Math.clamp = function(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}
}