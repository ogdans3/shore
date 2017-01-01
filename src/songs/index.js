var path = require("path");
var fs = require("fs");
var ytdl = require(path.join(path.join(__dirname, "/.."), "/youtube/download.js")); //TODO: Clean this up, should prob use the app file paths
var mm = require('musicmetadata');
var mv = require('mv');

var app;
var util;

var getFileName = function(filepath){
        return path.basename(filepath, path.extname(filepath));
}

var addSong = function(db, song, cb){
	console.log("Song to add", song);
	
	db.find({$or: [{_id: song._id}, {title: song.title}, {_id: song.title}, {title: song._id}]}).exec(function(err, docs){
		console.log(err, docs);
		if(err)
			cb(err)
		else{
			if(docs.length == 0){
				db.insert(song, function(err, doc){
					cb();
				});
			}else{
				cb();
			}
		}
	});
}

var processSong = function(filepath, cb){
	var parser = mm(fs.createReadStream(filepath), {duration: true}, function(err, metadata){
		if(err){
			cb(null, err);
			return;
		}

		//TODO: Add more fields here
		var song = {
			title: getFileName(filepath),
			filepath: filepath,
			duration: metadata.duration,
			_id: util.uuid()
		}
		cb(song);
	});
}

var addFromYoutube = function(path, url, cb){
	ytdl(path, url, function(err, finalPath){
		if(err)
			cb(null, err);
		else{
			processSong(finalPath, function(song){
				addSong(app.get("dbs").songs, song, function(){
					cb(song);
				});
			});
		}
	});
}

var addFromLocal = function(path, url, cb){
	processSong(url, function(song){
		addSong(app.get("dbs").songs, song, function(){
			cb(song);
		});
	});	
}

var updateSongPath = function(id, filepath, cb){
	app.get("dbs").songs.update({_id: id}, {$set: {filepath: filepath}}, function(err, doc){
		cb(doc, err);
	});
}

var mvFile = function(song, newPath, cb){
	mv(song.filepath, newPath, {mkdirp: true}, function(err) {
		if(err)
			cb("Error occured when moving file", err);
		else{						
			updateSongPath(song._id, newPath, function(doc, err){
				if(err)
					cb("Error occured", err);
				else
					cb("Song added");
			})
		}
	});
}

var add = function(method, url, path, cb){
	var songFolder = app.get("config").paths.songs;
	switch(method){
		case "youtube":
			addFromYoutube(path, url, function(song, err){
				if(err){
					cb("Error occured", err);
					return;
				}
				var newPath = songFolder + "/youtube/" + song._id;
				mvFile(song, newPath, cb);
			});
			break;
		case "local":
			addFromLocal(path, url, function(song, err){
				if(err){
					cb("Error occured", err);
					return;
				}
				var newPath = songFolder + "/local/" + song._id;
				mvFile(song, newPath, cb);
			});
			break;
		default:
			console.log("Default method for adding a new song is returning an error");
			cb("Unknown method for adding a song", null);
	}
}

var addFromRequest = function(req, res){
	console.log("Add new song");
	var path = app.get("config").paths.songs;

	add(req.body.method, req.body.url, path, function(what, diag){
		res.send(what, diag);
	});
}

var initialise = function(app_){
	app = app_;
	util = require(app.get("config").paths.util);
}

module.exports = {addFromRequest: addFromRequest, add: add, initialise: initialise};