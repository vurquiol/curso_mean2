'use strict'

require('dotenv').config();

const express = require('express');
const cors = require('cors');
var app = require('./app');

const { dbConnection } = require('./database/config');

// Crear el servidor de express


// Configurar CORS
app.use( cors() );

// Base de datos
dbConnection();


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});

