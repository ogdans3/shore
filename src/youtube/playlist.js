var ypi = require('youtube-playlist-info');

var objInList = function(list, elem, id){
	for(var i = 0; i < list.length; i++){
		if(elem[id] == list[i][id])
			return true;
	}
	return false;
}

var diff = function(db, list, cb){
	var finalList = [];
	db.find({}).exec(function(err, docs){
		if(err){
			cb(null);
			return null;
		}

		for(var i = 0; i < list.length; i++){
			if(!(objInList(docs, list[i], "id") || objInList(docs, list[i], "title"))){
				finalList.push(list[i]);
			}
		}
		cb(finalList);
	})
}

var scan = function(url, db, cb){
	var list = [];

	ypi.playlistInfo("AIzaSyB5j-INQByclZqToXkyW-LVJCqXOS7HjrU", url, function(playlistItems) {
		
		for(var i = 0; i < playlistItems.length; i++){
			var obj = playlistItems[i];
			var song = {
				title: obj.title,
				id: obj.resourceId.videoId,
				method: "youtube",
				url: "http://www.youtube.com/watch?v=" + obj.resourceId.videoId
			}
			list.push(song);
		}
		diff(db, list, function(result){
			if(result === null){
				console.log("An error happened, unable to scan playlist")
				return;
			}
			cb(result);
		});
	});
}

module.exports = {
	scan: scan
}