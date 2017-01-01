var mkdirp = require('mkdirp');

module.exports = function(app){
	var dirs = app.get("config").dirs;
	for(var i = 0; i < dirs.length; i++){
		mkdirp(dirs[i], function (err) {
			if(err) 
				console.error(err);
		    else
		    	console.log("Finished setup of directories");
		});
	}
}