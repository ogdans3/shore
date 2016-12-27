var path = require('path');

//Create all routes for the application
exports.createRoutes = function(app){
	var config = app.get("config");

	//Define get requests
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

	app.get("/api/get/playlists", function(req, res){
		app.get("dbs").playlists.find({}).sort({title: 1}).exec(function(err, playlists){
			res.send(playlists);
		});
	});

	//Define post requests
	app.post("/api/new/playlist", function(req, res){
		console.log("New playlist");
		console.log(req.body)
		var playlist = {
			title: req.body.title,
			songs: req.body.songs || [],
			editable: true
		};

		app.get("dbs").playlists.insert(playlist, function(err, newDoc){
			if(err)
				res.send("Error");
			else
				res.send(newDoc);
		})
	})

}