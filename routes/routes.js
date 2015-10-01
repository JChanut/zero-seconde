/**
 * Created by Thomas on 05/08/2015.
 */
module.exports = function(app, express) {

    var bodyParser = require('body-parser'),
        path = require('path');

   // app.use(express.cookieParser());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

// create application/json parser
    var jsonParser = bodyParser.json();



    //==============================================================================
    //               Page de connexion
    //==============================================================================
    app.all('/', function (req, res) {
        req.session.user = "guest";
        res.sendFile(path.resolve(__dirname + '/../views/index.html'));
    });


    //==============================================================================
    //               Authentification
    //==============================================================================
    app.route('/authentification').post(jsonParser, function (req, res) {
        req.getConnection(function (err, conn) {

            if (err) return console.log('Connection fail: ' + err);


            //construction de la query

            var getQuery = 'SELECT id_utilisateur , id_gare, fonction FROM zs_utilisateur WHERE identifiant = "' + req.body.username + '" AND mot_de_passe ="' + req.body.password+ '"';
            var query = conn.query(getQuery, function (err, rows) {

                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                var data = (rows.length > 0);
                var result = {};
                if(data){
                    var row = rows[0];
                    req.session = {
                        user: row.fonction,
                        id_user: row.id_utilisateur,
                        id_gare: row.id_gare,
                        id_prevision:-1
                    };

                    result= {
                        fonction: row.fonction
                    };
                }
                result.connexion = data;
                res.json(result);

            });

        });

    });

    app.all("/deconnexion",function(req,res){
        console.log(req.session);
        req.session = {
            user: "guest",
            id_user: -1,
            id_gare: -1,
            id_prevision:-1
        };
        res.send();
    });

    var ace = require(path.resolve(__dirname + "/routeur_ace.js"));
    app.use('/ace',ace);

    var od = require(path.resolve(__dirname + "/routeur_od.js"));
    app.use('/od',od);

    //==============================================================================
    //               404 NOT FOUND
    //==============================================================================
    app.use(function (req, res) {
        res.redirect("/");
    });
};


