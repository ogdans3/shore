var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');

module.exports = function(path, url, cb){
	if(!cb)
		cb = function(){};

	console.log("Starting download of new song", "To: ", path, "URL: ", url);
	ytdl.getInfo(url, function(err, info){
		if(err){
			cb(err);
		}else{
			var downloadStream = ytdl(url, {
				filter: function(format){
				return format.resolution === null;
			}
		});

		ffmpeg(downloadStream)
			.noVideo()
			.format("mp3")
			.audioCodec('libmp3lame')
			.save(path + "/" + info.title + ".mp3")
			.on("end", function(){
				console.log("Song was successfully downloaded and converted to mp3");
				cb(null, path + "/" + info.title + ".mp3");
			}).on("error", function(error){
				cb(error)
			});
		}
	})
}
