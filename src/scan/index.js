var recursive = require('recursive-readdir');
var fs = require("fs");
var mm = require('musicmetadata');
var path = require("path");

var songDB;

var getFileName = function(filepath){
	return path.basename(filepath, path.extname(filepath));
}

var addSong = function(db, song, cb){
	db.find({title: song.title}, function(err, docs){
		if(err)
			console.log(err);
		else{
			if(docs.length == 0){				
				db.insert(song, function(err, doc){
					console.log("Insert of new song", "Error", err, "NewDoc", doc);
					cb();
				});
			}else
				console.log("Song already inserted");
		}
		cb();
	});
}

var processSongs = function(files){
	console.log(files);
	var filepath = files.shift();
	console.log(filepath);
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
		console.log("Song", song);
		addSong(songDB, song, function(){
			if(files.length > 0)
				processSongs(files);
		});
	});
}
	
module.exports = function(app, path){
	var songFolder = path || app.get("config").paths.songs;
	songDB = app.get("dbs").songs;
	
	recursive(songFolder, function(err, files){
		// Files is an array of filename 
		console.log(files);

		processSongs(files);
	});
}
