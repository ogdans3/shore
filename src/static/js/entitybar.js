//Variable to keep all playlists in memory, each playlist object also contains all the songs they contain.
var playlists = [];

//This function creates a new playlist
var newPlaylist = function(){
	var title  = prompt("Playlist title", "")
	if(title != null){
		$.post("/api/new/playlist", {title: title, songs: []}, function(res){
			console.log(res);
		})
	}
}

//This requests all the playlists from the server
var getAllPlaylists = function(){
	$.get("/api/get/playlists", function(res){
		for(var i = 0; i < res.length; i++){
			if(getPlaylistIndex(res[i]) != -1){
				playlists[getPlaylistIndex(res[i])] = res[i];
			}
			addPlaylistToList(res[i]);
		}
	})
}

//This returns the index of a playlist, based on the title, if found or -1.
var getPlaylistIndex = function(playlistObj){
	for(var i = 0; i < playlists.length; i++){
		if(playlists[i].title == playlistObj.title)
			return i;
	}
	return -1;
}

//This function adds a playlist object to the entity side bar
var addPlaylistToList = function(playlistObj){
	var string = "<li class = 'pointer'>" + playlistObj.title;
	string += "</li>";

	var ele = $(string);
	ele.click(function(){showPlaylist(playlistObj)});
	$("#entitybar ul.playlists").append(ele);
}

//This function shows all the songs in the playlist in the main view of the application
//TODO: implement
var showPlaylist = function(playlistObj){
}

getAllPlaylists();