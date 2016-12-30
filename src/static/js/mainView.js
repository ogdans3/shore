//This function shows all the songs in the playlist in the main view of the application
var showPlaylist = function(playlistObj){
	$("#songList").empty();

	console.log(playlistObj.songs);
	console.log(playlistObj);
	for(var i = 0; i < playlistObj.songs.length; i++){
		var song = getSongElement(playlistObj.songs[i]);
		$("#songList").append(song);
	}
}

//This function shows all the songs in the songs 
var showAllSongs = function(){
	console.log("All songs");
	$("#songList").empty();

	for(var i = 0; i < songs.length; i++){
		var song = getSongElement(songs[i]);
		$("#songList").append(song);
	}
}


var getSongElement = function(songObj){
	console.log(songObj);
	var li = "<li class = 'song element' draggable = 'true' id ='" + songObj._id + "'>";
	li += "<span class = 'song element container'>";

	li += "<span class = 'flex grow textAlignCenter first'>";
	li += songObj.title;
	li += "</span>";

	li += "<span class = 'flex grow textAlignCenter first'>";
	li += songObj.duration || "Unknown";
	li += "</span>"

	li += "</span></li>";

	li = $(li);

	li.click(function(){
		playTrack(songObj)
	});
	li.on("dragstart", dragStart);
	return li;
}

var addFakeSongs = function(playlistObj){
	var fakeSongs = [{title: "Test 1", _id: "1231232"}, {title: "Test 2", _id: "12312322"}, {title: "Test 3", _id: "123123222"}, {title: "Test 4", _id: "12312323"}];
	songs = fakeSongs;
	playlistObj.songs = fakeSongs;
}