var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var connectionOne = require('./model/connectionOne');  
var Users = connectionOne.model('users');
var connectionTwo = require('./model/connectionTwo');  
var Songs = connectionTwo.model('songs');
var request = require('request');
var engines = require('consolidate');
var ObjectId = require('mongodb').ObjectId;
const pug = require('pug');

var app = express();

app.use(express.static(__dirname + '/assets'));
app.use('/dashboard', express.static(__dirname + '/assets'));
app.use('/profile', express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({   
	extended: true
}));

const compiledSongFunction = pug.compileFile('songpage.pug');

function load_song(response, in_db, res, type) {

	console.log("Loading track...")

	var J_response = JSON.parse(response);

	var track_id = J_response.id;
	var track_name;
	var track_artist;
	var track_album;
	var track_cover_art;
	var track_demo;
	var track_comments;
	var track_ext_link;
	var song;
	var options;
	var html;

	//Add song to database
	if(in_db == false) {
		console.log("Grabbing song from spotify.")
		track_name = J_response.name;
		track_artist = J_response.artists[0].name;
		track_album = J_response.album.name;
		track_cover_art = J_response.album.images[0].url;
		track_demo = J_response.preview_url;
		track_ext_link = J_response.external_urls.spotify;

		console.log(track_ext_link);

		options = {
			coverArt: track_cover_art,
			songDemo: track_demo,
			songName: track_name,
			artistName: track_artist,
			albumName: track_album,
			likes: 0,
			comments: [],
			externalLink: track_ext_link
		};

		song = {
			songid: track_id,
			name: track_name,
			likes: 0,
			artist: track_artist,
			reports: 0,
			demo: track_demo,
			album: track_album,
			cover_art: track_cover_art,
			external_link: track_ext_link
		};
		html = compiledSongFunction(options);
		Songs.collection.insert(song);
		res.status('200');
		if(type == 'page') {
			res.send(html);
		} else if(type == 'JSON') {
			res.send(song);
		}
	//Load song from database
	} else {
		console.log("Loading from database.");
		Songs.findOne({'songid': track_id}, function(err, song) {
			track_name = song.name;
			track_artist = song.artist;
			track_album = song.album;
			track_cover_art = song.cover_art;
			track_demo = song.demo; 
			track_likes = song.likes;
			track_comments = song.comments;
			track_ext_link = song.external_link;
			options = {
				coverArt: track_cover_art,
				songDemo: track_demo,
				songName: track_name,
				artistName: track_artist,
				albumName: track_album,
				likes: track_likes,
				comments: track_comments,
				externalLink: track_ext_link
			};
			html = compiledSongFunction(options);
			res.status('200');
			if(type == 'page') {
				res.send(html);
			} else if(type == 'JSON') {
				res.send(song);
			}
		});
	}
}

function get_track(body, res, type) {
	var J_res = JSON.parse(body);
	if(JSON.parse(body).tracks.items.length != 0) {
		var track_id = JSON.parse(body).tracks.items[0].id;

		var track_url = "https://api.spotify.com/v1/tracks/" + track_id;
		request.get({
			url: track_url
		}, function(error, track_response, body) {
			if(error) {
				console.log(error);
			} else {
				Songs.collection.count({songid: track_id}, function(err, count) {
					var in_db;
					if(count != 0) {
						in_db = true;
					} else {
						in_db = false;
					}
					if(type == 'page') {
						return load_song(body, in_db, res, type);
					} else if(type == 'JSON') {
						return load_song(body, in_db, res, type);
					}
				});
				
			}
			});
	} else {
		console.log("Couldn't find a track");
		res.status('404');
		res.send();
	}
}

app.get('/', function(req, res) {
	var errorMsgs = { 'errors': {} };
	res.render('login', errorMsgs);
});

app.get('/drop', function(req, res) {
	Users.collection.drop();
	Songs.collection.drop();
	res.send();
});

app.post('/', function(req, res) {
	//check database for username
	var givenParsed = JSON.parse(JSON.stringify(req.body));
	var givenUsername = givenParsed.username;
	var givenPassword = givenParsed.password;

	Users.find({}).exec(function(err, AllUsers){
		if (err) throw err;
		//check if account is verified
		var accountConfirmed = false;
		outUsers = JSON.stringify(AllUsers);
		for (i = 0; i < AllUsers.length; i++) { 
			var user = JSON.stringify(AllUsers[i]);
			var json = JSON.parse(user);
			if  (json.username == givenUsername && 
				json.password == givenPassword){
				accountConfirmed = true;	
			}
		}
		//User doesn't exist, add to db
		if(accountConfirmed){
			res.json({success: true});
			console.log(givenUsername + " is signed in");
		}
		//user exists
		else{
			res.json({success: false});
			console.log("Invalid Username or Password")
		}

	});
});

app.post('/register', function(req, res) {
	
	//check database for username
	var givenParsed = JSON.parse(JSON.stringify(req.body));
	var givenUsername = givenParsed.username;
	var givenPassword = givenParsed.password;
	var givenEmail = givenParsed.email;

	Users.find({}).exec(function(err, AllUsers){
		if (err) throw err;
		//check if user exists
		var userFound = false;
		outUsers = JSON.stringify(AllUsers);
		for (i = 0; i < AllUsers.length; i++) { 
			var user = JSON.stringify(AllUsers[i]);
			var json = JSON.parse(user);
			if  (json.username == givenUsername){
				userFound = true;   
			}
		}
		//User doesn't exist, add to db
		if(!userFound){
			res.json({success: true});
			var response = {
			username:givenUsername,
			password:givenPassword,
			email:givenEmail,
			bio:'',
			songname:'',
			songartist:'',
			songid:'',
			songimage:'',
			interest:'',
			preference:'',
			recentlyplayed:'',
			likes:[]
			};
			new Users(response).save(function (err, newBook) {
				if (err) {
					throw err;
				} else {
					
					console.log("User Created");
				}
			});
		}
		//user exists
		else{
			res.json({success: false});
			console.log("User already Exists!")
		}

	});
	
});

app.get(['/findsong/:track/:artist', '/findsong/:track'], function(req, res) {
	var track_name = req.params.track;
	var artist = req.params.artist;
	var spotify_q = "";

	if(artist != null) {
		spotify_q = "artist:" + artist + " track:" + track_name;
	} else {
		spotify_q = "track:" + track_name
	}
	spotify_q = encodeURIComponent(spotify_q);
	var search_url = 'https://api.spotify.com/v1/search?q=' + spotify_q + "&type=track&offset=0&limit=1";
	var search_type = "track";

	request.get({
		url: search_url
	}, function(error, response, body) {
		if(error) {
			console.log(error);
		} else {
			console.log("Finding track on Spotify...");
			return get_track(body, res, 'JSON');
		}
	});

});

app.get('/findsongid/:track/:artist', function(req, res) {
	var track_name = req.params.track;
	var artist = req.params.artist;
	var spotify_q = "";

	if(artist != null) {
		spotify_q = "artist:" + artist + " track:" + track_name;
	} else {
		spotify_q = "track:" + track_name
	}
	spotify_q = encodeURIComponent(spotify_q);
	var search_url = 'https://api.spotify.com/v1/search?q=' + spotify_q + "&type=track&offset=0&limit=1";
	var search_type = "track";

	request.get({
		url: search_url
	}, function(error, response, body) {
		if(error) {
			console.log(error);
		} else {
			console.log("Finding trackid on Spotify...");
			res.json({success: body});
		}
	});

});

app.get('/getrecommended/:trackid', function(req, res) {
	var track_id = req.params.trackid;
	var spotify_q = "seed_tracks=" + track_id;

	spotify_q = encodeURIComponent(spotify_q);
	var search_url = 'https://api.spotify.com/v1/recommendations?market=ES&'
	 + spotify_q + "&limit=10" + "-H" + "Accept: application/json" + "-H" + "Authorization: Bearer BQD3smY_ibjGS2fAF9RKWDpPe8iBADx92Z5x1g_OeLBmYk6DrAf_YN5F0jNilTQWDrQntuFDlmhSzTNCPDUIx8hlSx5mjsB5JZIOZPXNO_WfedOFKUZr-m52dRpeZcIAJdOoMtUZKNmAKSf8HVBWbJVKI4zmWRQ";
	request.get({
		url: search_url
	}, function(error, response, body) {
		if(error) {
			console.log(error);
		} else {
			console.log("Finding trackid on Spotify...");
			res.json({success: body});
		}
	});

});


app.get('/dashboard', function(req, res) {
	var errorMsgs = { 'errors': {} };
	res.render('Dashboard', errorMsgs);
});

app.get(['/songpage/:track/:artist/:name', '/songpage/:track/:name', '/songpage/:id/:name'], function(req, res) {

	var errorMsgs = { 'errors': {} };
	var track_name = req.params.track;
	var artist = req.params.artist;
	//add to recently played
	var userName = req.params.name;
	var recentlyPlayedValue = track_name + ' - ' + artist;
	Users.update({username:userName},{recentlyplayed:recentlyPlayedValue}).exec(function(err, AllUsers){
		if (err) throw err;
	});

	var spotify_q = "";

	if(artist != null) {
		spotify_q = "artist:" + artist + " track:" + track_name;
	} else {
		spotify_q = "track:" + track_name
	}
	spotify_q = encodeURIComponent(spotify_q);
	var search_url = 'https://api.spotify.com/v1/search?q=' + spotify_q + "&type=track&offset=0&limit=1";
	var search_type = "track";

	request.get({
		url: search_url
	}, function(error, response, body) {
		if(error) {
			console.log(error);
		} else {
			console.log("Finding track on Spotify...");
			return get_track(body, res, 'page');
		}
	});
});

app.get('/userdata/:name', function(req, res) {
	var givenUsername = req.params.name;
	Users.find({username: givenUsername}).exec(function(err, UserInfo){
		if (err) throw err;
		res.json({success: UserInfo[0]});
	});
});

app.get('/dashboard/:name', function(req, res) {
	var errorMsgs = { 'errors': {} };
	res.render('Dashboard', errorMsgs);
});

app.get('/profile/:name', function(req, res) {

	var errorMsgs = { 'errors': {} };
	res.render('profile', errorMsgs);
});

app.post('/profile/:name', function(req, res) {
	var givenParsed = JSON.parse(JSON.stringify(req.body));
	var givenUsername = givenParsed.username;
	var givenBio = givenParsed.bio;
	var givenInterests = givenParsed.interest;
	var givenPreferences = givenParsed.preference;
	var givenRecentlyPlayed = givenParsed.recentlyplayed;
	var givenSong = givenParsed.songname;
	var givenArtist = givenParsed.songartist;
	var givenSongId = givenParsed.songid;
	var givenSongImage = givenParsed.songimage;

	if(givenBio != undefined){
		Users.update({username:givenUsername},{bio:givenBio}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
	if(givenInterests != undefined){
		Users.update({username:givenUsername},{interest:givenInterests}).exec(function(err, AllUsers){
		if (err) throw err;});
	
	}
	if(givenPreferences != undefined){
		Users.update({username:givenUsername},{preference:givenPreferences}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
	if(givenRecentlyPlayed != undefined){
		Users.update({username:givenUsername},{recentlyplayed:givenRecentlyPlayed}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
	if(givenSongId != undefined) {
		Users.update({username:givenUsername},{songid:givenSongId}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
	if(givenSong != undefined) {
		Users.update({username:givenUsername},{songname:givenSong}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
	if(givenArtist != undefined) {
		Users.update({username:givenUsername},{songartist:givenArtist}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
	if(givenSongImage != undefined) {
		Users.update({username:givenUsername},{songimage:givenSongImage}).exec(function(err, AllUsers){
		if (err) throw err;});
	}
});

app.post('/comment', function(req, res) {
	var username = req.body.username;
	var commentContents = req.body.comment;
	var songName = req.body.songname;

	songName = songName.trim();

	var new_comment;

	new_comment = {
		username: username,
		content: commentContents
	};

	Songs.collection.findOne({name: songName}, function(err, song) {
		if(err) throw err;
		//Song page doesn't exist.
		if(song == null) {
			res.status('404');
			res.send();
		} else {
			Users.collection.findOne({username: username}, function(err, user) {
				if(err) throw err;
				//User does not exist.
				if(user == null) {
					res.status('403');
					res.send();
					//Request valid.    
				} else {
					var song_id = ObjectId(song._id);
					Songs.findById(song_id, function(err, upsong) {
						
						
						upsong.comments.push(new_comment);

						upsong.save(function(err) {
							if(err) throw err;
							res.status('200');
							res.send();
						});
						
					});

				}
			});
		}
	});
});

app.post('/like', function(req, res) {
	var username = req.body.username;
	var songName = req.body.songname;
	songName = songName.trim();

	Songs.collection.findOne({name: songName}, function(err, song) {
		if(err) throw err;
		if(song == null) {
			res.status('404');
			res.send();
		} else {
			Users.collection.findOne({username: username}, function(err, user) {
				if(err) throw err;
				if(user == null) {
					res.status('403');
					res.send();
				} else {
					
					var gUsername = user.username;
					var gID = ObjectId(user._id);
					var songId = song.songid;
					var song_id = ObjectId(song._id);
					var already_liked = false;

					var i;
					for(i = 0; i < user.likes.length; i++) {
						if(user.likes[i].songid == songId) {
							already_liked = true;
						}
					}

					if(already_liked == false) {
						Users.findById(gID, function(err, upuser) {
							var new_song = {songid: songId};
							upuser.likes.push(new_song);
							upuser.save(function(err, user) {
								if(err) throw err;
								Songs.findById(song_id, function(err, upsong) {
									if(err) throw err;
									upsong.likes = upsong.likes + 1;
									upsong.save(function(err, song){
										if(err) throw err;
										res.status('200');
										res.send();
									})
								});
							});
						});
					}
				}
			});
		}
	});
});

app.get('/register', function(req, res) {
	var errorMsgs = { 'errors': {} };
	res.render('createaccount', errorMsgs);
});


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');