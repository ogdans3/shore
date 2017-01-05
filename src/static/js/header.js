var rescan = function(){
	$.post("/api/scan/rescan", function(result){
		console.log(result);
	})
}

var watchPlaylist = function(){
	 swal.setDefaults({
		  input: 'text',
		  confirmButtonText: 'Next &rarr;',
		  showCancelButton: true,
		  animation: false,
		  progressSteps: ['1', '2', '3']
		})

		var steps = [
		  {
		    title: "URL",
		  },
		  {
			  title: "How frequent? (hours)",
			  text: "How often should the server rescan the playlist to find new songs?",
			  inputValue: "24"
		  },
		  {
			  input: 'select',
			  inputOptions: {
			    "youtube": "Youtube",
			  }
		  }
		]
  	
		swal.queue(steps).then(function (result) {
		  swal.resetDefaults()
		  
		  var watchObj = {
			  url: result[0],
			  howOften: result[1],
			  method: result[2]
		  }
		  $.post("/api/watch/new", watchObj, function(result){
			  swal({text: result, type: "success"});
		  }).fail(function(msg){
			  swal({title: "Error occured", text: msg.responseText, type: "error"});
		  });
		  
		}, function () {
		  swal.resetDefaults()
		})
}