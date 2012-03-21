var path = require('path'),
	bndlr = require('bndlr'),
	uglify = require('uglify-js'),
	jsparser = uglify.parser,
	jsprocessor = uglify.uglify,
	cleancss = require('clean-css'),
	env = process.env.NODE_ENV || 'development'
	;

if(env === "development"){
	/*
	Eliminate the md5 filenames in development.
	This is only used if the files are written to disk.
	...It is NOT relevant to the urls that may serve the bundles/files!
	*/

	bndlr.Bundle.prototype.uniqueNamer =
	bndlr.StaticFile.prototype.uniqueNamer = function(){
		return this.filename.toLowerCase() +'.'+ this.type;
	};

	bndlr.Bundle.prototype.uniqueMinNamer =
	bndlr.StaticFile.prototype.uniqueMinNamer = function(){
		return this.filename.toLowerCase() +'.min.'+ this.type;
	};

	//watch for changes to the files
	bndlr.StaticFile.watch = true;
}

/*
	The static content is spread out in many directories,
	Setting statisDir is irrelevant in this scenario.

 bndlr.staticDir = 'public';
*/


//When a bundle config is opened, this will be called for every
//filename referenced allowing you to interpret where the absolute paths are.
bndlr.getFilePath = function(info){
	//paths that start with '/' are absolute by the time they get here.
	if(info.filename[0]=='/')
		return info.filename+(info.ext||'');

	//Return a path that is relative to the config that was opened.
	//Here we will yeild a path like:
	//      {webroot}/areas/splash/static/js/splash.js
	if(info.configdir)
		return path.join(info.configdir, 'static', info.type, info.filename+(info.ext||''));

	//info came from a url
	return path.join(bndlr.webroot, 'areas', info.area, 'static', info.type, info.filename+(info.ext||''));
};


//bndlr does not dictate what compressor it uses.
//So you MUST specify them if you want compression!
bndlr.StaticFile.compressors.js = function(content){
	//from the uglify-js example
	var ast = jsparser.parse(content); // parse code and get the initial AST
	ast = jsprocessor.ast_mangle(ast); // get a new AST with mangled names
	ast = jsprocessor.ast_squeeze(ast); // get an AST with compression optimizations
	var final_code = jsprocessor.gen_code(ast); // compressed code here
	return final_code;
};
bndlr.StaticFile.compressors.css = function(content){
	return cleancss.process(content);
};

//Examine the request to determine if it the middleware should respond.
bndlr.middleware.inspect = function(req){
	//look for static urls.
	//for our purposes- anthing that is: {area_name}/{static_type}/{whatever}
	var m = /^(?:\/areas)?\/([a-z]+)(?:\/static)?\/(js|css|html|swf|img)\/([^?]+)/.exec(req.url);
	if(!m) return null;

	var min = false,
		ext = '',
		//look for url ending in .min[.ext]
		filename = m[3].replace(/(\.min)?(\.[a-z]+)?(\?.+|$)/, function(){
			min=!!arguments[1];
			ext=arguments[2];
			return "";
		});

	//return the useful info found
	return {
		area: m[1],
		type: m[2],//required
		filename: filename,//required
		ext: ext,
		min: min
	};
};

//gets the config needed for the url inspected above
bndlr.middleware.getConfig = function(info){
	var configPath = path.join(bndlr.webroot, 'areas', info.area, bndlr.configName);
	if(path.existsSync(configPath))
		return bndlr.open(configPath);
};

//create the urls that will point to the bndlr.middleware
function staticUrl(type, filename, min, area){
	if(filename[0] != '/')
		filename = '/'+path.join(area, type, filename);
	if(min)
		filename = bndlr.addMin(filename);
	return filename;
};
bndlr.staticUrl = staticUrl;

bndlr.dynamicHelpers.style = function(req, res){
	var min = !!+(req.query.min||exports.min);
	return function(filename, area){
		if(!area){
			area = /\/areas\/([^/]+)\//.exec(this.filename);
			if(area) area = area[1]||'common';
		}
		return '<link rel=stylesheet href="' +staticUrl('css',filename, min, area)+ '" />';
	};
}
bndlr.dynamicHelpers.script = function(req, res){
	var min = !!+(req.query.min||exports.min);
	return function(filename, area){
		if(!area){
			area = /\/areas\/([^/]+)\//.exec(this.filename);
			if(area) area = area[1]||'common';
		}
		return '<script src="' +staticUrl('js',filename, min, area)+ '"></script>';
	};
};
bndlr.dynamicHelpers.static = function(req, res){
	var min = !!+(req.query.min||exports.min);
	return function(type, filename, area){
		if(!area){
			area = /\/areas\/([^/]+)\//.exec(this.filename);
			if(area) area = area[1]||'common';
		}
		return staticUrl(type, filename, min, area);
	};
};

//return bndlr for convience
module.exports = bndlr;