var Datastore = require('nedb');
var path = require("path");

module.exports = function(app){
	var playlists = new Datastore({ filename: path.join(app.get("config").paths.db, "/playlists.db"), autoload: true });

	var dbs = {playlists: playlists};
	return dbs;
}