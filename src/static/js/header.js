var rescan = function(){
	$.post("/api/scan/rescan", function(result){
		console.log(result);
	})
}