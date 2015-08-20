/**
 * Created by Thomas on 05/08/2015.
 */
module.exports = function(app, express) {

    var bodyParser = require('body-parser'),
        router = express.Router(),
        path = require('path'),
        multiparty = require('multiparty');

   // app.use(express.cookieParser());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

// create application/json parser
    var jsonParser = bodyParser.json();



    //==============================================================================
    //               Page de connection
    //==============================================================================
    app.all('/', function (req, res) {
        req.session.user = "guest";
        res.sendFile(path.resolve(__dirname + '/../views/index.html'));
       // delete req.session.id_user;
       // delete req.session.id_prevision;
    });


    //==============================================================================
    //               Authentification
    //==============================================================================
    app.route('/authentification').post(jsonParser, function (req, res) {
        req.getConnection(function (err, conn) {

            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);      // JSON req

            //construction de la query

            var getQuery = 'SELECT id_utilisateur , id_gare, fonction FROM zs_utilisateur WHERE identifiant = "' + req.body.username + '" AND mot_de_passe ="' + req.body.password+ '"';
            var query = conn.query(getQuery, function (err, rows) {

                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                var data = (rows.length > 0);
                var result = {};
                result.connexion = data;
                if(data){
                    row = rows[0];
                    req.session.user = row.fonction;
                    req.session.id_user = row.id_utilisateur;
                    req.session.id_gare = row.id_gare;
                    result.fonction = row.fonction;
                }

                res.json(result);

            });

        });

    });

    var ace = require(path.resolve(__dirname + "/routeur_ace.js"));
    app.use('/ace',ace);

    var ace = require(path.resolve(__dirname + "/routeur_od.js"));
    app.use('/od',od);

    //==============================================================================
    //               404 NOT FOUND
    //==============================================================================
    app.use(function (req, res, next) {
        res.status(404).sendFile(path.resolve(__dirname + '/../public/404/notFound.html'));
    });
};


