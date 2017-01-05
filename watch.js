var url = require('url');
var util = require(__dirname + "/util");

//Variables that are populated on init call
var yt_pl;
var songDB, watchDB;
var songs, songPath;

var scans = [];

var youtube = function(obj, db, cb){
	console.log("Starting youtube watch process for a playlist");
	var url_parts = url.parse(obj.url, true);

	yt_pl.scan(url_parts.query.list, db, cb);
}

var scan = function(app, cb){	
	watchDB.find({}, function(err, docs){
		for(var i = 0; i < docs.length; i++){
			var obj = docs[i];
			
			single(obj, cb);
		}
	})
};

var single = function(obj, cb){
//	console.log("Preparing scan of: ", obj);
	if(scans.indexOf(obj.url) > -1){
		console.log("Scan already initialised");
		cb([], []);
		return;
	}
	scans.push(obj.url);
	switch(obj.method){
		case "youtube":
			youtube(obj, songDB, function(list){
				util.addAllSongs(songs, songPath, list, function(successList, failList){
					scans.splice(scans.indexOf(obj.url), 1);
					cb(successList, failList);
				});
			});
			break;
		default:
			console.log("No known method for the watch object");
	}
}

var init = function(app){
	yt_pl = require(app.get("config").paths.src.youtube + "/playlist");	
	songDB = app.get("dbs").songs;
	watchDB = app.get("dbs").watch;

	songs = require(app.get("config").paths.src.srcPath + "/songs");
	songPath = app.get("config").paths.songs;

}

module.exports = {
	single: single,
	init: init
}