var dragStart = function(event){
	console.log("Drag start");
    event.dataTransfer = event.originalEvent.dataTransfer;
	event.dataTransfer.setData("song", event.target.id);
	console.log("IDDDDDDDDDD: ", event.target.id);
}

var dragover = function(event){
    event.preventDefault();
}

var drop = function(event){
	console.log("Something was dropped on me");
    event.dataTransfer = event.originalEvent.dataTransfer;

    var songId = event.dataTransfer.getData("song");
    var playlist = findPlaylist(event.target.parentElement.id);
    var song = findSong(songId);

    addNewTrackToPlaylist(song, playlist);
}