ar mongoose = require('mongoose');
var db  = require('../mongoose').db;

var UserSchema = new mongoose.Schema( {
        uid: { type: Number, index: true, min: 1 },
        username: String,
		password: String,
        email: String, 
		gender: String, 
		address: String
    });
	
var UserModel =  db.model('User', UserSchema);
module.exports.UserModel = UserModel;
//module.exports = mongoose.model('User',{ username: String, 
//								password: String, email: String, gender: String, address: String })

