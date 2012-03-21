
/*
By default, these paths are relative to the dorectory this config is in.
*/

var common = require('bndlr').open(__dirname + '/../common/bundle.config.js');

module.exports = {
	//types. By default these coordinate with directory names.
	css: {
		//only 1 file? go ahead, be lazy- leave out the array.
		splash: 'splash.css'
	},
	js: {
		splash: 'splash.js',
		jqui: [
			common.js.jqui,
			//start with a '/' to use webroot paths
			'/areas/common/static/js/jquery.ui/jquery.ui.draggable.js',
			'/areas/common/static/js/jquery.ui/jquery.ui.droppable.js'
		]
	}
};
