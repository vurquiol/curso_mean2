'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name:{
		type: String,
		require:true
	},
	surname: {
		type: String,
		require:true		
	},

	email: {
		type: String,
		require:true,
		unique: true
	},
	password: {
		type: String,
		require:true,
		unique: true
	},
	role: {
		type: String,
		require:true,
		default:'USER_ROLE'
	},
		
	image:{
		type: String,
	}
})

module.exports = mongoose.model('User', UserSchema);