var pathname = window.location.pathname;
var username = pathname.split('/')[2];

function checkTrack(){
	//check if track exists
	//if so go to track page
	trackPage();
}


function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function checkUserSelectedSong(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
	var name = {username: userName};

	$.ajax({
 	url: '/userdata/' + userName,
 	datatype: "json",
 	type: "GET",
 	data: name,
 	success: function(response){
 		var userData = JSON.parse(JSON.stringify(response.success));
 		if(userData.songname == '' && userData.songartist == ''){
 			alert("Need To Select A Reference Song In Your Profile Page");
		}
		else{
				$.ajax({
 					url: 'https://api.spotify.com/v1/recommendations?market=ES&seed_tracks=' + userData.songid + '&limit=10',
			 		headers: {
			   			'Authorization': 'Bearer ' + 'BQAmveBfyc2eqliJ3nsfVBtpZK5RT4j6u2kW7djIULA-hAmAqOly6If1AR-DtU6A4tlL7lyzy0x-yIfeRCHMMxjm6qlawyuUuLafVJ3foIpHCSuiHLi-ab3g2ic1hMWHsh9D9bU_irIQ7PM6uXRKV2za4TPRbSk'
			    	},
			    	accepts: "application/json; charset=utf-8",
			 		success: function(response){
						var randomSong = response.tracks[Math.floor(Math.random() * response.tracks.length)];
						var randomSongArtist = randomSong.artists[0].name;
						var randomSongName = randomSong.name;
						console.log(randomSongName);
						console.log(randomSongArtist);
						song_url =  'http://localhost:3000/songpage/' + encodeURIComponent(randomSongName) + "/" + encodeURIComponent(randomSongArtist) + "/" + username;
						window.location.href = song_url;
					}
				});
		}
	}});
}

function fillDashboard(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
	var name = {username: userName};

	$.ajax({
 	url: '/userdata/' + userName,
 	datatype: "json",
 	type: "GET",
 	data: name,
 	success: function(response){
 		var userData = JSON.parse(JSON.stringify(response.success));
 		if(userData.songname == '' && userData.songartist == ''){
		}
		else{
				$.ajax({
 					url: 'https://api.spotify.com/v1/recommendations?market=ES&seed_tracks=' + userData.songid + '&limit=10',
			 		headers: {
			   			'Authorization': 'Bearer ' + 'BQAmveBfyc2eqliJ3nsfVBtpZK5RT4j6u2kW7djIULA-hAmAqOly6If1AR-DtU6A4tlL7lyzy0x-yIfeRCHMMxjm6qlawyuUuLafVJ3foIpHCSuiHLi-ab3g2ic1hMWHsh9D9bU_irIQ7PM6uXRKV2za4TPRbSk'
			    	},
			    	accepts: "application/json; charset=utf-8",
			 		success: function(response){
						document.getElementById("ImageOne").src = response.tracks[0].album.images[0].url;
						document.getElementById("TrackOne").innerHTML = response.tracks[0].name + " - " + response.tracks[0].artists[0].name;
						document.getElementById("AlbumOne").innerHTML = "Album: " + response.tracks[0].album.name;
						document.getElementById("LinkOne").href = response.tracks[0].external_urls.spotify;
						document.getElementById("SongDurationOne").innerHTML = "Duration: " + millisToMinutesAndSeconds(response.tracks[0].duration_ms);

						document.getElementById("ImageTwo").src = response.tracks[1].album.images[0].url;
						document.getElementById("TrackTwo").innerHTML = response.tracks[1].name + " - " + response.tracks[1].artists[0].name;
						document.getElementById("AlbumTwo").innerHTML = "Album: " + response.tracks[1].album.name;
						document.getElementById("LinkTwo").href = response.tracks[1].external_urls.spotify;
						document.getElementById("SongDurationTwo").innerHTML = "Duration: " + millisToMinutesAndSeconds(response.tracks[1].duration_ms);

						document.getElementById("ImageThree").src = response.tracks[2].album.images[0].url;
						document.getElementById("TrackThree").innerHTML = response.tracks[2].name + " - " + response.tracks[2].artists[0].name;
						document.getElementById("AlbumThree").innerHTML = "Album: " + response.tracks[2].album.name;
						document.getElementById("LinkThree").href = response.tracks[2].external_urls.spotify;
						document.getElementById("SongDurationThree").innerHTML = "Duration: " + millisToMinutesAndSeconds(response.tracks[2].duration_ms);
						
						

					}
				});
		}
	}});
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