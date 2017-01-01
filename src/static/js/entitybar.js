//This function creates a new playlist
var newPlaylist = function(){
	var title  = prompt("Playlist title", "")
	if(title != null){
		$.post("/api/playlist/new", {title: title, songs: []}, function(res){
//			console.log(res);
		})
	}
}

//This requests all the playlists from the server
var getAllPlaylists = function(){
	$.get("/api/get/playlists", function(res){
		for(var i = 0; i < res.length; i++){
			if(getPlaylistIndex(res[i]) != -1){
				playlists[getPlaylistIndex(res[i])] = res[i];
			}else{
				addPlaylistToList(res[i]);
				playlists.push(res[i]);
			}
		}
	})
}

//This requests all songs from the server
var getAllSongs = function(){
	$.get("/api/get/songs", function(res){
		for(var i = 0; i < res.length; i++){
			console.log(res);
			if(getSongIndex(res[i]) != -1){
				songs[getSongIndex(res[i])] = res[i];
			}else
				songs.push(res[i]);
		}
	})
}

//This returns the index of a playlist, based on the id, if found or -1.
//TODO: Move to data file
var getPlaylistIndex = function(playlistObj){
	for(var i = 0; i < playlists.length; i++){
		if(playlists[i]._id == playlistObj._id)
			return i;
	}
	return -1;
}

//This returns the index of a song, based on the id, if found or -1.
//TODO: Move to data file
var getSongIndex = function(songObj){
	for(var i = 0; i < songs.length; i++){
		if(songs[i]._id == songObj._id)
			return i;
	}
	return -1;
}

//This function adds a playlist object to the entity side bar
var addPlaylistToList = function(playlistObj){
	var string = "<li class = 'playlist element pointer' id = '" + playlistObj._id + "'>";

	string += "<span class = 'container'>";
	string += playlistObj.title;
	string += "</span>";

	string += "</li>";

	var ele = $(string);
	ele.click(function(){showPlaylist(playlistObj)});
	$("#entitybar ul.playlists").append(ele);

	ele.on("drop", drop);
	ele.on("dragover", dragover);
}

getAllPlaylists();
getAllSongs();