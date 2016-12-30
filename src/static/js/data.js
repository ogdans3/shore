//Variable to keep all playlists in memory, each playlist object also contains all the songs they contain.
var playlists = [];

//Variable to keep all songs in memory
var songs = [];


var find = function(id, list){
	for(var i = 0; i < list.length; i++){
		if(id === list[i]._id)
			return list[i];
	}
	return null;
};

var findPlaylist = function(id){return find(id, playlists)};
var findSong = function(id){return find(id, songs)}