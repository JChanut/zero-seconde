/**
 * Created by Alan on 04/08/2015.
 */

var express = require('express'),
    router = express.Router(),
    path = require('path'),
    bodyParser = require('body-parser'),
    connection = require('express-myconnection'),
    mysql = require('mysql'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    app = express();

//==============================================================================
// APP CONFIGURATION
//==============================================================================
// use body-parser pour les POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create application/json parser
var jsonParser = bodyParser.json();

// MySQL connection
app.use(
    connection(mysql, {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'zero_sec',
        debug    : false // true -> debug logger
    }, 'request')
);


////Permet l'affichage d'info dans la console lors des requetes
app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));


//Lien vers le fichier routes.js afin d'assurer les redirections d'url
require('./routes/routes.js')(app,router, jsonParser);

//==============================================================================
//START THE SERVER
//==============================================================================
app.listen(3030);
module.exports = app;


