var path = require("path");
var songs = require(path.join(path.join(__dirname, "/.."), "/songs"));
var scan = require(path.join(path.join(__dirname, "/.."), "/scan")); //TODO: Clean this up, should prob use the app file paths
var ytdl = require(path.join(path.join(__dirname, "/.."), "/youtube/download.js")); //TODO: Clean this up, should prob use the app file paths
var mm = require('musicmetadata');
var fs = require("fs");
var moment = require("moment");

var util;

//Create all routes for the application
exports.createRoutes = function(app){
	util = require(app.get("config").paths.util);

	songs.initialise(app);
	var config = app.get("config");

	//Define get requests
	app.get('/song/:id', function (req, res){
		console.log("Get song");
		app.get("dbs").songs.findOne({_id: req.params.id}).exec(function(err, song){
		    res.sendFile(song.filepath);
		});
	});

	app.get("/webpage/js/lib/:where/:script", function(req, res){
	    res.sendFile(path.join(path.join(config.paths.src.lib, req.params.where), req.params.script));
	});
	app.get("/webpage/js/:script", function(req, res){
	    res.sendFile(path.join(config.paths.static.js, req.params.script));
	});

	app.get("/webpage/css/lib/:where/:style", function(req, res){
	    res.sendFile(path.join(path.join(config.paths.src.lib, req.params.where), req.params.style));
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
	app.post("/api/watch/scan", function(req, res){
		app.get("watch")(app);
		res.send("Scan initialised");
	});

	app.post("/api/watch/new", function(req, res){
		console.log("Add new watched object");

		var db = app.get("dbs").watch;
		var watched = {
			method: req.body.method,
			url: req.body.url,
			howOften: parseInt(req.body.howOften) || 24,
			lastScan: moment().unix()
		};
		if(watched.url == ""){
			res.status(401).send("Empty url");
			return;
		}
		db.find({url: watched.url}).exec(function(err, results){
			if(results.length == 0){
				db.insert(watched, function(err, newDoc){
					if(err){
						res.status(500).send("Unable to add watched object", err);
					}else{
						res.send("Playlist was added to watch list");
					}
					//The object was added, so we scan all the objects.
					app.get("schedule")(app);
				});
			}else{
				res.send("Watched object was already added");
				//The object was already present but we want to rescan the object to find new entities
				//Most likely there will be something new or else the user would probably not try to add it again
				app.get("watch")(app);
			}
		})
	})


	app.post("/api/songs/new", function(req, res){
		songs.addFromRequest(req, res);
	});

	app.post("/api/scan/rescan", function(req, res){
		console.log("Perform a rescan of the library");
		scan(app);
	})


	app.post("/api/playlist/new", function(req, res){
		console.log("Add new playlist");
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
		
		app.get("dbs").songs.find({_id: req.body.songId}).exec(function(err, songs){
			var song = songs[0];
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
			    		//TODO: Handle error
						if(err)
							res.send("Error", err);
						else
							res.send("Song added");
			        });
				}
			});

		});
	})

}
