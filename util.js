const uuidV1 = require('uuid/v1');

var addAllSongs = function(songsModule, path, list, finalCB){
	var processElement = function(element, cb, successList, failList){
		songsModule.add(element.method, element.url, path, function(what, diag){
			if(!diag){
				console.log("Song added");
				successList.push(element);
			}
			else{
				console.log("Unable to add song", what, "\n", diag, "\n");
				failList.push(element);
			}
			//Continue to process the list even if an error occured
			cb(processElement);
		});
	}
	processListSync(list, processElement, function(successList, failList){
		console.log("Succesfully added", successList.length, "of", successList.length + failList.length, "songs");
		if(finalCB)
			finalCB(successList, failList);
	}, [], []);
}

var processListSync = function(list, func, finalCB, successList, failList){
	if(list === undefined || list === null || list.length == 0){
		finalCB(successList, failList);
		return;
	}
	var ele = list.shift();
	func(ele, function(func){
		if(list.length > 0)
			processListSync(list, func, finalCB, successList, failList);
		else{
			if(finalCB)
				finalCB(successList, failList);
		}
	}, successList, failList);
}

var uuid = uuidV1 //-> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 

module.exports = {
	processListSync: processListSync,
	addAllSongs: addAllSongs,
	uuid: uuid
}