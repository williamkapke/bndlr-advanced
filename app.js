
var express = require('express'),
	//Use a config to make any customizations
	bndlr = require('./config/bndlr.config.js'),
	app = express.createServer(),
	webroot = __dirname;


app.use(express.favicon(__dirname + '/areas/common/static/images/favicon.ico'));
app.use(bndlr.middleware);
app.use(app.router);

//setup Jade and turn layout off for Express 3 compat
app.set('view engine', 'jade');
app.set('view options', { layout: false, pretty: true });


app.dynamicHelpers(bndlr.dynamicHelpers);
app.dynamicHelpers({
	title: function(req, res){
		return (res.title? res.title + ' | ': '') + 'bndlr-advanced'
	}
})

//sorry- keeping the routing simple
app.get('/', function(req, res){
	var min = !!+(req.query.min||exports.min),
		common = bndlr.open(webroot + '/areas/common/bundle.config.js');
	res.render(webroot + '/areas/splash/views', {
		min:min,
		webroot: webroot,
		common:common,
		isBundle: function(file){
			return file instanceof bndlr.Bundle;
		},
		addMin: function(filename){
			return bndlr.addMin(filename);
		},
		splash:bndlr.open(webroot + '/areas/splash/bundle.config.js')
	});
});
/*
app.get('/', function(req, res){
	var min = !!+(req.query.min||exports.min);
	res.render(webroot + '/areas/splash/views', {min:min});
});
var common = require('bndlr').open('../common/bundle.config.js');
*/
app.listen(80);
console.log('Express app started on port 80');