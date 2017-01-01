var recursive = require('recursive-readdir');
var fs = require("fs");
var mm = require('musicmetadata');
var path = require("path");

var songDB;
	
module.exports = function(app){
	var songs = require(path.join(path.join(__dirname, "/.."), "/songs"));	
	var songFolder = app.get("config").paths.songs;
	var util = require(app.get("config").paths.util);

	songDB = app.get("dbs").songs;
	
	recursive(songFolder, function(err, files){
		// Files is an array of filename 
		var objects = [];
		for(var i = 0; i < files.length; i++){
			objects.push({
				url: files[i],
				method: "local"
			});
		}

		if(objects.length > 0){
			util.addAllSongs(songs, songFolder, objects);
		}

//		processSongs(files);
	});
}
