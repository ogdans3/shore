var path = require("path");

module.exports = function(app){
	return new Config(app);
}

function Config(app){
	var self = this;
	var srcPath = path.join(__dirname, "/src");
	var staticPath = path.join(srcPath, "/static");

	var static = 	{	path: staticPath,
						html: path.join(staticPath, "/html"),
						js: path.join(staticPath, "/js"),
						css: path.join(staticPath, "/css"),
						images: path.join(staticPath, "/images")
					}
	var songs = path.join(__dirname, "/songs");
	var routes = path.join(srcPath, "/routes"); 

	self.paths = {static: static, songs: songs, routes: routes};
	
	console.log("Config object:", self)
}