var mongoose = require('mongoose');
connectionTwo = require('./connectionTwo');
var Schema = mongoose.Schema;

var Songs = new Schema(
  {
	songid: {
	  type: String,
	  required: true,
	  unique: true
	},
	name: {
	  type: String
	},
	likes: {
	  type: Number
	},
	comments: [{
        username: String,
        content: String,
        date: {type: Date, default: Date.now}
    }],
	artist: {
	  type: String,
	},
	reports: {
	  type: Number
	},
	demo: {
	  type: String,
	  unique: true
	},
	album: {
	  type: String
	},
	cover_art: {
	  type: String
	},
	external_link: {
		type: String
	}
  },
  {
	collection: 'songs'
  }
);

module.exports = connectionTwo.model('songs', Songs);