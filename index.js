var express = require('express'),
    path = require("path");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var app = express();

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
 
//Create all the routes for the application
require(app.get("config").paths.routes).createRoutes(app);

//Final setup
app.listen(2000)
console.log("Listening to port 2000");
