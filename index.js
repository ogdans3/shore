var express = require('express'),
    path = require("path");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var app = express();

var util = require(__dirname + "/util");

//Set config for the application
app.set("config", require(__dirname + "/config")(app));

//Set all the databases for the application
app.set("dbs", require(__dirname + "/db")(app));

//app.get("dbs").songs.insert({title: "Test", artist: "Unknown", duration: 120}, function(){});

//Set up body parser for html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//Setup up view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Initialise all watched playlists and folders to find new songs and so on
var watch = require(__dirname + "/watch");
app.set("watch", watch);
watch(app, function(list){
	var songs = require(app.get("config").paths.src.srcPath + "/songs");
	var path = app.get("config").paths.songs;

	var processElement = function(element, cb){
		console.log("Element", element);

		songs.add(element.method, element.url, path, function(what, diag){
			if(!diag)
				console.log("Song added");
			else
				console.log("Unable to add song")
			console.log(what, diag);
			cb(processElement);
		});
	}
	util.processListSync(list, processElement);
});

//Create all the routes for the application
require(app.get("config").paths.routes).createRoutes(app);


//Final setup
app.listen(2000)
console.log("Listening to port 2000");
