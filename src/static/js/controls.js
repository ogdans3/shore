var audio = document.getElementById("playback");
audio.autoplay = true;
var repeat = false;

var buttons = {};
buttons.play_pause = $("#play_pause");

var queue = {
	index: 0,
	prefix: "/song",
	songs: ["Oh Wonder - All We Do.mp3", "Developers.mp3"]
}

var createAudioEventHandlers = function(){
	audio.onpause = function(){ addPlayClass() };
	audio.onplay = function(){ removePlayClass() };
	audio.ontimeupdate = function(){
		$("#timebar .progress").width((100 * audio.currentTime / audio.duration) + "%");
		setCurrentTime(audio.currentTime);
	}
	audio.ondurationchange = function(){
		setDuration(audio.duration);
	}
	audio.onended = function(){
		trackEnded();
	}
}

var createControlEventHandlers = function(){
	$("#play_pause").click(function(){
		togglePlayback();
	});
	$("#next").click(function(){
		nextTrack();
	});
	$("#previous").click(function(){
		previousTrack();
	});

	$("#timebar").click(function(e){
		var parentOffset = $(this).offset();
		var relX = e.pageX - parentOffset.left;
		var relY = e.pageY - parentOffset.top;
		var perc = relX/$(this).innerWidth();
		var newCurrTime = perc * audio.duration;

		setPlayBackTime(newCurrTime);
	});
}

var transformSecondsToTime = function(d){
	d = Number(d);
	var m = Math.floor(d / 60);
	var s = Math.floor(d % 60);
	return (m + ":" + (s < 10 ? "0" : "") + s);
}

var trackEnded = function(){
	if(repeat){
		repeatTrack();
	}else{
		nextTrack();
	}
}

var repeatTrack = function(){
	audio.currentTime = 0;
}

var nextTrack = function(){
	if(queue.songs.length != 0 && queue.index < queue.songs.length - 1){
		queue.index = queue.index + 1;
		var newTrack = queue.songs[queue.index];
		playTrack(newTrack);
	}
}
var previousTrack = function(){
	if(queue.songs.length != 0 && queue.index > 0 && audio.currentTime < 10){
		queue.index = queue.index - 1;
		var newTrack = queue.songs[queue.index];
		playTrack(newTrack);
	}else if(audio.currentTime > 10){
		setPlayBackTime(0);
		audio.play();
	}
}

var playTrack = function(song){
	var title = song;
	if(song.title)
		title = song.title;

	$("#playback").attr("src", queue.prefix + "/" + title);
	console.log(audio.currentSrc)
	audio.load();
	audio.play();
}

var setPlayBackTime = function(time){
	audio.currentTime = time;
}
var setCurrentTime = function(time){
	$("#currTime .number").text(transformSecondsToTime(time));
}
var setDuration = function(time){
	$("#duration .number").text(transformSecondsToTime(time));
}

var addPlayClass = function() {
	buttons.play_pause.addClass("play");
};

var removePlayClass = function() {
	buttons.play_pause.removeClass("play");
};

createAudioEventHandlers();
createControlEventHandlers();


var togglePlayback = function(){
	if(audio.paused)
		audio.play();
	else
		audio.pause();
}

if(audio.played){
	removePlayClass();
}
setDuration(audio.duration);


var addNewTrackToPlaylist = function(song, playlist){
	console.log("Add new song to playlist");
	console.log(song);
	console.log(playlist);
	$.post("/api/playlist/add", {songId: song._id, playlistId: playlist._id}, function(res){
		console.log("Response", res);
		//TODO: Handle error for unable to add song to playlist
	})
}




