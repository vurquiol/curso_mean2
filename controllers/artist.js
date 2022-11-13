'user strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');
var moongosePaginate = require('mongoose-pagination');
var Artist =require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artist){
				res.status(404).send({message: 'No existe el artista'});
			
			}else{
				res.status(200).send({artist});
			}
		}
	});
}


function saveArtist (req,res) {
	var artist = new Artist();

	var params = req.body;	
	//console.log(params);

	artist.name = params.name;
	artist.description = params.description;		
	artist.image = 'null'; 
	
	
	artist.save((err, artistStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'No se ha guardado el artista'});
						
			}else{
				res.status(200).send({artist: artistStored});
							
			}
				
		}
	});	
}

function getArtists(req,res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	
	var iteamsPerPage = 3;

	Artist.find().sort('name').paginate(page, iteamsPerPage,function(err,artist,total){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artist){
				res.status(404).send({message: 'No hay artista'});
						
			}else{
				return res.status(200).send({
					total_items: total,
					artist: artist});
							
			}
				
		}
	});
}


function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err,artistUpdate) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el artista'});
		}else{
			if(!artistUpdate){
				res.status(404).send({message: 'No se ha podido actualizar el artista'});
			}else{
				res.status(200).send({artist: artistUpdate});
			}
		}
	});



}


module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist
}