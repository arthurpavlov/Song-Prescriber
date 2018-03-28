var pathname = window.location.pathname;
var username = pathname.split('/')[4];

function checkTrack(){
	//check if track exists
	//if so go to track page
	trackPage();
}

function trackPage(){
	location.href = "songpage";
}


function goDashboard(){
	location.href = "/dashboard/" + username;
}

function goProfile(){
	location.href = "/profile/" + username;
}

function goLogin(){
	location.href = "/";
}

function trackPage(){
	location.href = "songpage";
}

function load_song_data(response) {
	var track_name = response.name;
	var artist = response.artists[0].name;
	var album = response.album.name;
	var cover_art_src = response.album.images[0].url;
	var demo_url = response.preview_url;


	document.getElementById("song-info-name").firstChild.innerHTML = track_name;
	document.getElementById("artist-info").innerHTML = "<strong>Artist:</strong> " + artist;
	document.getElementById("album-info").innerHTML = "<strong>Album:</strong> " + album;
	document.getElementById("cover-art").src = cover_art_src;
	document.getElementById("player").src = demo_url;


}

function get_track(response) {
	console.log(response);
	if(response.tracks.items.length != 0) {
		var track_id = response.tracks.items[0].id;
		var track_url = "https://api.spotify.com/v1/tracks/" + track_id;
		console.log(track_url);
		$.ajax({
			url: track_url,
			success: load_song_data
		});
	} else {
		alert("Couldn't find a song");
	}
}

$(function(){
	$('.searchButton').on('click', function(){
		var query = document.getElementById("searchText").value.split("-");
		var track_name = query[0].replace(/^\s+|\s+$/g, "").replace(/\s/, "%20");
		var song_url = "http://localhost:3000/songpage/";

		if(query.length == 2) {
			var artist = query[1].replace(/^\s+|\s+$/g, "").replace(/\s/, "%20");
			song_url =  song_url + track_name + "/" + artist + "/" + username;
			
			window.location.href = song_url;
		} else if(query.length == 1 && query[0] == '') {
			alert("Need Input To Search");
		}
		else if(query.length == 1){
			song_url = song_url + track_name + "/" + username;
			window.location.href = song_url;
		}


	})

});

$(function(){
	$('.buttonPost').on('click', function() {
		var content = $('.commentBox').val();
		console.log(content);
		var url = "http://localhost:3000/comment";
		var songname = document.getElementById("song-info-name").textContent;

		var data = {
			username: username,
			comment: content,
			songname: songname
		};

		$.ajax({
			url: url,
			contentType: "application/json",
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify(data),
			success: location.reload()
		});
	});
});

$(function(){
	$('.buttonLike').on('click', function() {
		var url = "http://localhost:3000/like";
		var songname = document.getElementById("song-info-name").textContent;

		var data = {
			username: username,
			songname:songname
		};
		
		$.ajax({
			url: url,
			contentType: "application/json",
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify(data),
			success: location.reload()
		});
	});
});
