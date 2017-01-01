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
						images: path.join(staticPath, "/images"),
					}
	var songs = path.join(__dirname, "/songs");
	var routes = path.join(srcPath, "/routes"); 
	var db = path.join(__dirname, "/db");
	var youtubeSrc = path.join(srcPath, "/youtube");

	var src = {
		srcPath: srcPath,
		youtube: youtubeSrc
	}

	self.paths = {static: static, songs: songs, routes: routes, db: db, src: src};
	
	console.log("Config object:", self)
}