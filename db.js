var Datastore = require('nedb');
var path = require("path");

module.exports = function(app){
	var playlists = new Datastore({ filename: path.join(app.get("config").paths.db, "/playlists.db"), autoload: true });
	var songs = new Datastore({ filename: path.join(app.get("config").paths.db, "/songs.db"), autoload: true });
	var watch = new Datastore({ filename: path.join(app.get("config").paths.db, "/watch.db"), autoload: true });

	var dbs = {playlists: playlists, songs: songs, watch: watch};
	return dbs;
}