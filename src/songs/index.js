var path = require("path");
var fs = require("fs");
var ytdl = require(path.join(path.join(__dirname, "/.."), "/youtube/download.js")); //TODO: Clean this up, should prob use the app file paths
var app;


var processSong = function(filepath, cb){
	var parser = mm(fs.createReadStream(filepath), {duration: true}, function(err, metadata){
		if(err){
			console.log("Error happened", filepath, err);
			return;
		}
		console.log(metadata);
		//TODO: Add more fields here
		var song = {
			title: getFileName(filepath),
			duration: metadata.duration
		}
		console.log("Metadata: ", song);
		cb(song);
	});
}

var addFromYoutube = function(path, url, cb){
	ytdl(path, url, function(err, finalPath){
		if(err)
			cb("Unable to add song", err);
		else{
			processSong(finalPath, function(song){
				addSong(app.get("dbs").songs, song, function(){
					cb("Song added");
				});
			});
		}
	});
}

var add = function(method, url, path, cb){
	switch(method){
		case "youtube":
			addFromYoutube(path, url, function(what, diag){
				cb(what, diag);
			});
			break;
		default:
			console.log("Default method for adding a new song is returning an error");
			cb("Unknown method for adding a song", null);
	}
}

var addFromRequest = function(req, res){
	console.log("Add new song");
	console.log(req.body);
	var path = app.get("config").paths.songs;

	add(req.body.method, req.body.url, path, function(what, diag){
		res.send(what, diag);
	});
}

var initialise = function(app_){
	app = app_;
}

module.exports = {addFromRequest: addFromRequest, add: add, initialise: initialise};