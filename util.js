var addAllSongs = function(songsModule, path, list){	
	var processElement = function(element, cb){
		console.log("Element", element);

		try{
			songsModule.add(element.method, element.url, path, function(what, diag){
				if(!diag)
					console.log("Song added");
				else
					console.log("Unable to add song")
				console.log(what, diag);
			});
		}catch(e){
			cb(processElement);
		}
	}
	processListSync(list, processElement);
}

var processListSync = function(list, func){
	var ele = list.shift();
	func(ele, function(func){
		if(list.length > 0)
				processListSync(list, func);
	})
}

module.exports = {
	processListSync: processListSync,
	addAllSongs: addAllSongs
}
