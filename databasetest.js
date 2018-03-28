'use strict';

// Make sure to install these dependencies!
// Instructions are in the README.
var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var connectionOne = require('./model/connectionOne');  
var Users = connectionOne.model('users');
var connectionTwo = require('./model/connectionTwo');  
var Songs = connectionTwo.model('songs');


var app = express();

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');


// The request body is received on GET or POST.
// This middleware just simplifies things a bit.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

app.get('/', function(req, res) {
    var errorMsgs = { 'errors': {} };
    res.render('login', errorMsgs);
});

app.post('/', function(req, res) {
	var response = {
        username:req.body.username,
        password:req.body.password,
        img:'',
        songnames:[''],
        songids:[''],
        interests:[''],
        preferences:[''],
        recentlyplayed:['']
    };
    new Users(response).save(function (err, newBook) {
         if (err) {
                throw err;
            } else {
                
                Users.find({}, function(err, AllUsers) {
                    if (err) throw err;
                    var outUsers = JSON.stringify(AllUsers[0]);
                    var json = JSON.parse(outUsers);
                    console.log(json.username);
                    res.end(JSON.stringify(AllUsers));
                });
            }
        });


});

var server = app.listen(3000, function() {
  console.log('Running on 127.0.0.1:%s', server.address().port);
});