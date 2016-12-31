var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');

module.exports = function(path, url, cb){
	if(!cb)
		cb = function(){};

	console.log("Starting download of new song", "To: ", path, "URL: ", url);
	ytdl.getInfo(url, function(err, info){
		if(err){
			console.log("Error occured", err);
			return;
		}else{
			console.log(info)
			console.log("Title: ", info.title);

			var downloadStream = ytdl(url, {
				filter: function(format){
						return format.resolution === null;
					}
				});

			ffmpeg(downloadStream)
              .noVideo()
              .audioCodec('libmp3lame')
              .save(path + "/" + info.title);
		}
	})
}