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
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('connect-flash'),//use to see requests
    app = express();

//==============================================================================
// APP CONFIGURATION
//==============================================================================
// use body-parser pour les POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
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

passport.use('local-login', new LocalStrategy({
        username : 'username',
        password : 'password',
        passwordReqToCallback : true
    },
    function(req, username, password, done){
        var getQuery = 'SELECT id, fonction FROM zs_utilisateur WHERE identifiant = "' + username + '" AND mot_de_passe ="' + password + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                return done(err);
            }
            var data = (rows.length > 0);
            var result = {};
            result.connexion = data;
            if (!data) {
                return done(null, false, req.flash('loginMessage', 'Identifiants incorrects.'));
            } else {
                result.id = rows[0].id;
                result.fonction = rows[0].fonction;
            }
            return done(null, result);
        });
    }
));


require('./routes/routes.js')(app,router, jsonParser, passport);

//==============================================================================
//START THE SERVER
//==============================================================================
app.listen(3030);
module.exports = app;


