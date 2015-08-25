/**
 * Created by Alan on 04/08/2015.
 */

var express = require('express'),
    path = require('path'),
    cookieSession = require('cookie-session'),
    connection = require('express-myconnection'),
    mysql = require('mysql'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
   // cookieParser = require('cookie-parser'),
    app = express();

//==============================================================================
// APP CONFIGURATION
//==============================================================================
// use body-parser pour les POST requests

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));


// MySQL connection
app.use(
    connection(mysql, {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'zero_sec',
        charset : 'utf8_bin',
        debug    : false // true -> debug logger
    }, 'request')
);


////Permet l'affichage d'info dans la console lors des requetes
app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));


//Lien vers le fichier routes.js afin d'assurer les redirections d'url
require('./routes/routes.js')(app, express);
//

//==============================================================================
//START THE SERVER
//==============================================================================
app.listen(3030);
module.exports = app;


