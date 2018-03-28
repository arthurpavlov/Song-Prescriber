//http://www.zertz.ca/handling-multiple-databases-and-connections-with-mongoose/

var mongoose = require('mongoose'),  
    mongoURI = 'mongodb://localhost/users';

module.exports = connectionOne = mongoose.createConnection(mongoURI);

connectionOne.on('connected', function() {  
  console.log('users database is running...');
});

require('./users')  