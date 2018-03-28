var mongoose = require('mongoose');
connectionOne = require('./connectionOne');
var Schema = mongoose.Schema;

var Users = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      requried: true
    },
    email: {
      type: String,
      requried: true
    },
    bio: {
      type: String
    },
    songname: {
      type: String
    },
    songid: {
      type: String
    },
    songartist: {
      type: String
    },
    songimage: {
      type: String
    },
    interest: {
      type: String
    },
    preference: {
      type: String
    },
    recentlyplayed: {
      type: String
    },
    likes: [{
      songid: String
    }]
  },
  {
    collection: 'users'
  }
);

module.exports = connectionOne.model('users', Users);
