(function() {
	"use strict";
	
	var express = require('express'),
		app = express(),
		indexController = require('./controller/index');
		
	app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
		
	app.get('/I/want/title/', indexController.i_want_title);
	
	app.get('*', function(req, res) {
		// Render 404.
		res.status(404);
		res.end("Sorry, but this page is not alive anymore!");
	});
	
	app.listen(8080);
})();
