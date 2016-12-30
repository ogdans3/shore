var path = require("path");
var scan = require(path.join(path.join(__dirname, "/.."), "/scan")); //TODO: Clean this up, should prob use the app file paths

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
		app.get("dbs").playlists.find({}).sort({title: 1}).exec(function(err, docs){
			res.send(docs);
		});
	});

	app.get("/api/get/songs", function(req, res){
		app.get("dbs").songs.find({}).sort({title: 1}).exec(function(err, docs){
			res.send(docs);
		});
	});


	//Define post requests
	app.post("/api/scan/rescan", function(req, res){
		console.log("Perform a rescan of the library");
		console.log(req.body);

		//TODO: this needs to overwrite a path that is written into a txt file or something. 
		//So that on a restart of the server the same library is accessed
		var path = req.body.libraryPath;
		scan(app, path);
	})


	app.post("/api/playlist/new", function(req, res){
		console.log("New playlist");
		console.log(req.body)
		var playlist = {
			title: req.body.title,
			songs: req.body.songs || [],
			editable: true
		};

		app.get("dbs").playlists.insert(playlist, function(err, newDoc){
    		//TODO: Handle error
			if(err)
				res.send("Error");
			else
				res.send(newDoc);
		})
	});

	app.post("/api/playlist/add", function(req, res){
		console.log("Add song to playlist");
		console.log(req.body);
		
		app.get("dbs").songs.find({_id: req.body.songId}).exec(function(err, songs){
			var song = songs[0];
			console.log(song);
			if(song === undefined || song === null){
				res.send("Undefined song");
				return;
			}
			
			app.get("dbs").playlists.find({_id: req.body.playlistId}, function(err, playlists){
				if(err){
					res.send("Error, unable to find playlist");
				}else{
					var playlist = playlists[0];
					for(var i = 0; i < playlist.songs.length; i++){
						if(playlist.songs[i]._id == song._id){
							res.send("Song already added");
							return;
						}
					}
					app.get("dbs").playlists.update({_id: req.body.playlistId}, {$push: {songs: song}}, function(err, newDoc){
						console.log("Song added");
						console.log("Error", err);
						console.log("New doc", newDoc)
			    		//TODO: Handle error
						if(err)
							res.send("Error");
						else
							res.send("Song added");
			        });
				}
			});

		});
	})

}