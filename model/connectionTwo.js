//http://www.zertz.ca/handling-multiple-databases-and-connections-with-mongoose/

var mongoose = require('mongoose'),  
    mongoURI = 'mongodb://localhost/songs';

module.exports = connectionTwo = mongoose.createConnection(mongoURI);

connectionTwo.on('connected', function() {  
  console.log('songs database is running...');
});

require('./songs')  