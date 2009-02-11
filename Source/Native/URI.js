/*
Script: URI.js
	Provides methods useful in managing the window location and uris.

	License:
		MIT-style license.

	Authors:
		Aaron Newton, Lennart Pilon, Valerio Proietti
*/

var URI = new Native({

	initialize: function(uri){
		this.value = uri || document.location.href || '';
		this.length = uri.length;
	}

});

URI.prototype = new String;

URI.reg = /^(?:(\w+):\/\/)?(?:([^\/:?]*))?(?::(\d+))?([^#?]*)(?:\?([^#]*))?(?:#(.*))?$/;

URI.implement({

	toString: function(){
		return this.value;
	},

	valueOf: function(){
		return this.value;
	},

	parseURI: function(){ 
		var bits = this.match(URI.reg).associate([
			'full', 'protocol', 'domain', 'port', 'path', 'query', 'hash'
		]);
		delete bits.trash;
		return bits;		
	},

	set: function(part, value) {
		if (part == 'data') return this.setData(value);
		var bits = this.parseURI();
		bits[part] = value;
		this.combine(bits);
		return this;
	},

	get: function(part) {
		if (part == 'data') return this.getData();
		return this.parseURI()[part];
	},

	combine: function(bits){
		bits = bits || this.parseURI();
		var result = "";
		if (bits.protocol) result += bits.protocol + '://';
		if (bits.domain) result += bits.domain;
		if ($defined(bits.port)) result += bits.port + ':';
		if (bits.path) result += bits.path;
		if (bits.query) result += '?' + bits.query;
		if (bits.hash) result += '#' + bits.hash;
		this.value = new URI(result);
		return this;
	},

	getData: function(key){
		var qs = this.get('query');
		if (!$chk(qs)) return key ? null : {};
		var obj = qs.parseQuery();
		return key ? obj[key] : obj;
	},

	setData: function(values, merge){
		var merged = merge ? $merge(this.getData(), values) : values;
		var newQuery = "";
		for (key in merged) newQuery += key + '=' +merged[key] + '&';
		return this.set('query', newQuery.substring(0, newQuery.length-1));
	},

	go: function(){
		window.location.href = this.value;
	}

});