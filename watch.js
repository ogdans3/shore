var url = require('url');
var yt_pl;

var youtube = function(obj, db, cb){
	console.log("Starting youtube watch process for a playlist");
	var url_parts = url.parse(obj.url, true);

	yt_pl.scan(url_parts.query.list, db, cb);
}

module.exports = function(app, cb){
	var db = app.get("dbs").watch;
	yt_pl = require(app.get("config").paths.src.youtube + "/playlist");

	db.find({}, function(err, docs){
		for(var i = 0; i < docs.length; i++){
			var obj = docs[i];
			
			switch(obj.method){
				case "youtube":
					youtube(obj, app.get("dbs").songs, cb);
					break;
				default:
					console.log("No known method for the watch object");
			}

		}
	})
}