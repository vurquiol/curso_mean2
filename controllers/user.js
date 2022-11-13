'user strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var jwt = require('../services/jwt');



const saltRounds = 10;

function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador de usuarios del api rest con Node y Mongo'
	});
}

const saveUser = async(req,res) => {
	var user = new User();

	var params = req.body;
	const {email, password,nombre} = req.body;

	
	//console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null'; 
	
	const existeEmail = await User.findOne({email});

	if(existeEmail){
		res.status(400).send({message: 'El mail ya existe'} );
	}else{
		if(params.password != undefined){
		// Encriptar contraseña y guardar datos
		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(params.password,salt,function(err, hash){
				user.password = hash;
				if(user.name != null && user.surname != null && user.email != null){
						// Guardar el usuario
						
							user.save((err, userStored) =>{
							if(err){
								res.status(500).send({message: 'Error al guardar el usuario'});
							}else{
								if(!userStored){
									res.status(404).send({message: 'No se ha registrado el usuario'});
						
								}else{
									res.status(200).send({user: userStored});
						
								}
				
							}
							});
						
						
				}else{
					res.status(200).send({message: 'Rellena todos los campos'});
				}
			});
		});
		
	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}
	}
}


function loginUser(req, res){
	// BODY PARSE LO CONVIERTE A OBJETO JSON
	var params = req.body;


	//console.log(params);

	var email = params.email;
	var password = params.password;

	
	User.findOne({email}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{

				//Comprobar la contraseña
				bcrypt.compare(password, user.password ,function(err, check){
					if(check){
						//veolver los datos del usuario logeado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}

				});
			}

		}
	});
		

}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err,userUpdate) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdate){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdate});
			}
		}
	});



}


function uploadImage(req, res){
	
	var userId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_path.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext =='gif'){
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({user: userUpdated});
				}	
			});
				
		}else{
			res.status(200).send({message: 'Extensión no valida'});
		}


				
		console.log(file_split);
		
	}else{
		res.status(200).send({message: 'No se ha subido ninguna imagen...'});
	}
}


function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var pathfile = './uploads/users/' + imageFile;

	fs.exists(pathfile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathfile));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};