'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArtistSchema = Schema({
	name: {
		type: String,
		require:true		
	},
	description: {
		type: String,
		require:true		
	},
	image: {
		type: String,
	}
	
})

module.exports = mongoose.model('Artist', ArtistSchema);