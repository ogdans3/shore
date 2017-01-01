var mkdirp = require('mkdirp');
var util = require(__dirname + "/util");

module.exports = function(app){
	var dirs = app.get("config").dirs;

	var processDir = function(element, cb){
		mkdirp(element, function (err) {
			if(err){
				//An error occured when we tried to create a directory
				console.error(err);
				console.log("The directory we tried to create", dirs[i]);
				process.exit(1);
			}
			cb(processDir);
		});
	}
	util.processListSync(dirs, processDir, function(){
		console.log("Finished creating initial directories");
	});
}