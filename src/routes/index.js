var path = require('path');

//Create all routes for the application
exports.createRoutes = function(app){
	var config = app.get("config");

	//Define gets
	app.get('/song/:id', function (req, res){
	    res.sendFile(path.join(config.paths.songs, req.params.id));
	});

	app.get("/webpage/js/:script", function(req, res){
	    res.sendFile(path.join(config.paths.static.js, req.params.script));
	});
	app.get("/webpage/css/:style", function(req, res){
	    res.sendFile(path.join(config.paths.static.css, req.params.style));
	});
	app.get("/webpage/image/:image", function(req, res){
	    res.sendFile(path.join(config.paths.static.images, req.params.image));
	});

	app.get('/', function (req, res){
 		res.render("home");
	});
}