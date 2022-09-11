var mysql = require('mysql');

var con = mysql.createConnection({
	host     : 'localhost',
    database : 'bikretabd',
    user     : 'root',
    password : ''
}); 
module.exports = con;



 



// var mysql = require('mysql');

//  var con = mysql.createConnection({
//  	    host     : 'localhost',
//       database : 'bikreta',
//       user     : 'bikreta',
//       password : 'bikreta2022'
//  });
 
// module.exports = con;