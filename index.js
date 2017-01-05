Error.stackTraceLimit = Infinity;

//Express requirements
var express = require('express'),
    path = require("path");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var app = express();

//Functional requirements
var moment = require("moment");

//Required functions that are not npm modules
var util = require(__dirname + "/util");
var schedule = require(__dirname + "/schedule");

//Set config for the application
app.set("config", require(__dirname + "/config")(app));

//Create all directories that are not yet present in the local file systems
require(__dirname + "/createDirs")(app);

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
watch.init(app);
app.set("watch", watch);

//Schedule to scan all watchlists
app.set("schedule", schedule);
schedule.init(app);
schedule.all(app);

//Create all the routes for the application
require(app.get("config").paths.routes).createRoutes(app);


//Final setup
app.listen(2000)
console.log("Listening to port 2000");

