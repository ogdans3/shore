//This function shows all the songs in the playlist in the main view of the application
//TODO: implement
var showPlaylist = function(playlistObj){
	console.log("Add all these songs")
	console.log(playlistObj);
	addFakeSongs(playlistObj);
	$("#songList").empty();

	for(var i = 0; i < playlistObj.songs.length; i++){
		var song = getSongElement(playlistObj.songs[i]);
		$("#songList").append(song);
	}
}

var getSongElement = function(songObj){
	var li = "<li>";

	li += "<span class = 'flex grow textAlignCenter first'>";
	li += songObj.title;
	li += "</span>";

	li += "<span class = 'flex grow textAlignCenter first'>";
	li += songObj.duration || "Unknown";
	li += "</span>"

	li += "</li>";

	li = $(li);

	li.click(function(){
		playTrack(songObj)
	});
	return li;
}

var addFakeSongs = function(playlistObj){
	var fakeSongs = [{title: "Test 1"}, {title: "Test 2"}, {title: "Test 3"}, {title: "Test 4"}];
	playlistObj.songs = fakeSongs;
}