

var processListSync = function(list, func){
	var ele = list.shift();
	func(ele, function(func){
		if(list.length > 0)
				processListSync(list, func);
	})
}

module.exports = {
	processListSync: processListSync
}
