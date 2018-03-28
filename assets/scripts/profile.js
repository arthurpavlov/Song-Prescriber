var pathname = window.location.pathname;
var username = pathname.split('/')[2];

function checkTrack(){
	//check if track exists
	//if so go to track page
	trackPage();
}

function trackPage(){
	location.href = "songpage";
}

function getUserData(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
	var usernameField = document.getElementById("name");
	usernameField.innerHTML = userName;
	 var name = {username: userName};
		$.ajax({
 		url: '/userdata/' + userName,
 		datatype: "json",
 		type: "GET",
 		data: name,
 		success: function(response){
 			var userData = JSON.parse(JSON.stringify(response.success));
 			document.getElementById("profile-bio").innerHTML = userData.bio;
 			
 			if(userData.songname != '' && userData.songartist != ''){
 				document.getElementById("current-song").innerHTML = userData.songname + ' - ' + userData.songartist;
 				document.getElementById("current-song-art").src = userData.songimage;
			}

 			if(userData.interest != ''){
 				var newInterest = '<tr>	<td class="interest">' + userData.interest + '</td><td class="del-row" onclick="delete_table_entry(this); removeInterest();"><img class="delete-icon" alt="delete" src="\\images\\delete-icon.png"></td></tr>'
				$("#interests-table").append(newInterest);
			}
			if(userData.preference != ''){
				var newPreference = '<tr><td class="preference">' + userData.preference + '</td><td class="del-row" onclick="delete_table_entry(this); removePreference();"><img class="delete-icon" alt="delete" src="\\images\\delete-icon.png"></td></tr>';
				$("#preferences-table").append(newPreference);
			}
			if(userData.recentlyplayed != ''){
				document.getElementById("song-history").innerHTML = userData.recentlyplayed;
			}
 		}
	});
}


$(function () {
	$('#get-song').on('click', function() {
		var track_name;
		var q = document.getElementById("current-song-q").value.split(" - ");
		var track_name = q[0].replace(/^\s+|\s+$/g, "").replace(/\s/, "%20");
		var find_url = "http://localhost:3000/findsong/";

		if(q.length == 2) {
			var artist = q[1].replace(/^\s+|\s+$/g, "").replace(/\s/, "%20");
			find_url =  find_url + track_name + "/" + artist;
		} else if(q.length == 1) {
			find_url = find_url + track_name;
		}
		$.ajax({
			url: find_url,
			success: function(response) {
				var res_name = response.name;
				var art = response.cover_art;
				var artist = response.artist;

				var pathname = window.location.pathname;
				var userName = pathname.split('/')[2];
		
				//post song to database
				var song = {
					username: userName,
					songid: response.songid,
					songname: res_name,
					songartist: artist,
					songimage: art
				};
				$.ajax({
			 		url: '/profile/' + userName,
			 		datatype: "json",
			 		type: "POST",
			 		data: song
				});

				document.getElementById("current-song-art").src = art;
				document.getElementById("current-song").innerHTML = res_name + " - " + artist;
			}
		});
	});
});

function goDashboard(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
	location.href = "/dashboard/" + userName;
}

function goProfile(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
	location.href = "/profile/" + userName;
}

function goLogin(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
	location.href = "/";
}


//Most functions will require backend support to save data between sessions.

$(function(){
	$('.update-profile-button').on('click', function() {
		$('input, button, textarea, .del-row').each(function () {
			$(this).removeClass('hidden');
		});
	});
});

$(function(){
	$('.bio-update-button').on('click', function(){
		$('.bio').text($('.bio-update-text').val());
		var pathname = window.location.pathname;
		var userName = pathname.split('/')[2];
		
		//post bio to database
		var message = {username: userName,
				 bio: $('.bio-update-text').val()};
		$.ajax({
 		url: '/profile/' + userName,
 		datatype: "json",
 		type: "POST",
 		data: message
		});

	});
});

$(function(){
	$('.done-edit').on('click', function() {
		$(' button, textarea, .del-row').each(function () {
			$(this).addClass('hidden');
		});
		$('.update-profile-button').removeClass('hidden');
	});
});

$(function() {
	$('.update-account').on('click', function() {
		$('.new-pass').val("");
		$('.confirm-pass').val("");
		$('.display-name').text($('.new-display-name').val());
	});
});

$(function() {
	$('#add-interest').unbind('click').on('click', function() {
		var interest = $('#interest-text').val();
		var newInterest = '<tr>	<td class="interest">' + interest + '</td><td class="del-row" onclick="delete_table_entry(this)"><img class="delete-icon" alt="delete" src="\\images\\delete-icon.png"></td></tr>'
		$("#interests-table").append(newInterest);
		$("#interest-text").val("");
	});
});

$(function() {
	$('#add-preference').unbind('click').on('click', function() {
		var preference = $('#preference-text').val();
		var newPreference = '<tr><td class="preference">' + preference + '</td><td class="del-row" onclick="delete_table_entry(this)"><img class="delete-icon" alt="delete" src="\\images\\delete-icon.png"></td></tr>';
		$("#preferences-table").append(newPreference);
		$("#preference-text").val("");
	});
});


function delete_table_entry(e) {
	e.parentNode.parentNode.removeChild(e.parentNode);
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

function removeInterest(){
		var pathname = window.location.pathname;
		var userName = pathname.split('/')[2];
		
		//post bio to database
		var message = {username: userName,
				 interest: ''};
		$.ajax({
 		url: '/profile/' + userName,
 		datatype: "json",
 		type: "POST",
 		data: message
		});
}

$(function() {
	$('#add-interest').unbind('click').on('click', function() {
		var initialInterestsArray = []

		var cells = Array.prototype.slice.call(document.getElementById("interests-table").getElementsByTagName("td"));
		for(var i in cells){
			if((i % 2) == 0){
    		initialInterestsArray.push(cells[i].innerHTML);
    		}
		}
		if(initialInterestsArray.length == 1){
			alert("Maximum of 1 Interest");
		}
		else{
			var interest = $('#interest-text').val();
			var newInterest = '<tr>	<td class="interest">' + interest + '</td><td class="del-row" onclick="delete_table_entry(this); removeInterest();"><img class="delete-icon" alt="delete" src="\\images\\delete-icon.png"></td></tr>'
			$("#interests-table").append(newInterest);
			$("#interest-text").val("");
		
			var pathname = window.location.pathname;
			var userName = pathname.split('/')[2];
		
			var interestsArray = []

			var cells = Array.prototype.slice.call(document.getElementById("interests-table").getElementsByTagName("td"));
			for(var i in cells){
				if((i % 2) == 0){
    			interestsArray.push(cells[i].innerHTML);
    			}
			}
			//post push interest to database

			var message = {username: userName,
				 interest: interestsArray[0]};
			$.ajax({
 			url: '/profile/' + userName,
 			datatype: "json",
 			type: "POST",
 			data: message
			});
		}


	});
});

function removePreference(){
	var pathname = window.location.pathname;
	var userName = pathname.split('/')[2];
		
	//post bio to database
	var message = {username: userName,
			 preference: ''};
	$.ajax({
 	url: '/profile/' + userName,
 	datatype: "json",
 	type: "POST",
 	data: message
	});
}

$(function() {
	$('#add-preference').unbind('click').on('click', function() {
		var initialPreferenceArray = []

		var cells = Array.prototype.slice.call(document.getElementById("preferences-table").getElementsByTagName("td"));
		for(var i in cells){
			if((i % 2) == 0){
    		initialPreferenceArray.push(cells[i].innerHTML);
    		}
		}
		if(initialPreferenceArray.length == 1){
			alert("Maximum of 1 Preference");
		}
		else{
			var preference = $('#preference-text').val();
			var newPreference = '<tr><td class="preference">' + preference + '</td><td class="del-row" onclick="delete_table_entry(this); removePreference();"><img class="delete-icon" alt="delete" src="\\images\\delete-icon.png"></td></tr>';
			$("#preferences-table").append(newPreference);
			$("#preference-text").val("");
		
			var pathname = window.location.pathname;
			var userName = pathname.split('/')[2];
		
			var preferenceArray = []

			var cells = Array.prototype.slice.call(document.getElementById("preferences-table").getElementsByTagName("td"));
			for(var i in cells){
				if((i % 2) == 0){
    			preferenceArray.push(cells[i].innerHTML);
    			}
			}
			//post push interest to database

			var message = {username: userName,
				 preference: preferenceArray[0]};
			$.ajax({
 			url: '/profile/' + userName,
 			datatype: "json",
 			type: "POST",
 			data: message
			});
		}
	});
});