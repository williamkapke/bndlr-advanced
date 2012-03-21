// Date prototype extentions
Date.prototype.addDays = function(value){
	this.setDate(this.getDate() + value); return this;
};

// String prototype extentions
jQuery.extend(String.prototype, {
	trimEnd: function () { return this.replace(/\s+$/, "") },
	trimStart: function () { return this.replace(/^\s+/, "") },
	endsWith: function (A) { return this.substr(this.length - A.length) === A },
	startsWith: function (A) { return this.substr(0, A.length) === A },
	parseNameValuePair: function (delimiter, modifier) {
		if (!delimiter) delimiter = "=";
		if (this[0] === delimiter) return null;
		var nameValueObject;
		var pos = this.search(delimiter);
		if (pos > 0) {
			nameValueObject = {
				name: this.substring(0, pos),
				value: this.substring(pos + 1)
			}
		}
		else nameValueObject = { name: this, value: "" };

		if (modifier) nameValueObject = modifier(nameValueObject);
		return nameValueObject;
	},
	parseNameValuePairs: function (pairDelimiter, nameValueDelimiter, nameValueModifier) {
		var _collection = {}, nameValuePair = null;
		var _pairs = this.split(pairDelimiter || '&');
		for (var i = 0; i < _pairs.length; i++) {
			nameValuePair = _pairs[i].parseNameValuePair(nameValueDelimiter, nameValueModifier);
			if (!nameValuePair) continue;
			_collection[nameValuePair.name] = nameValuePair.value;
		}
		return _collection;
	}
});
if (!String.prototype.trim) String.prototype.trim = function () { return jQuery.trim(this) }

Array.find = function Array$find(array, callback, instance) {
	for (var i = 0, l = array.length; i < l; i++) {
		if (callback.call(instance, array[i])) {
			return array[i];
		}
	}
};

if (!Array.forEach) {
	Array.forEach = function (array, callback, context) {
		for (var i = 0, C = array.length; i < C; i++) {
			var val = array[i];
			if (typeof val !== "undefined") {
				callback.call(context, val, i, array)
			}
		}
	};
}

head = document.getElementsByTagName("head")[0];
queryString = window.location.search.substring(1).parseNameValuePairs();