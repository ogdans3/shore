var express = require('express'),
    path = require("path");
var exphbs  = require('express-handlebars');
var app = express();

app.set('config', require(__dirname + '/config')(app));
require(app.get("config").paths.routes).createRoutes(app);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
app.listen(2000)
console.log("Listening to port 2000");
