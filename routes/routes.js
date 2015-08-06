/**
 * Created by Thomas on 05/08/2015.
 */
module.exports = function(app, express) {

    var bodyParser = require('body-parser'),
        router = express.Router(),
        path = require('path');

   // app.use(express.cookieParser());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

// create application/json parser
    var jsonParser = bodyParser.json();

    app.use('/',router);

    router.get('/', function (req, res) {
        req.session.user = "guest";
        res.sendFile(path.resolve(__dirname + '/../views/index.html'));
    });

    router.get('/retard',isLoggedIn, function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/retard.html'));
    });

    router.get('/ace/historique',isLoggedIn, function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/ACE/ace_historique.html'));
    });

    router.get('/infos_retard', function (req, res){
        res.sendFile(path.resolve(__dirname + '/../views/infos_retard.html'))

        req.getConnection(function (err, conn) {
            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);

            var getQuery = 'SELECT id_unite, libelle FROM zs_unite';
            var query = conn.query(getQuery, function(err, rows){
                if (err) {

                    console.log(err);
                    res.status(500).send(err);
                }
                var result = [];

                for(var i=0;i<rows.length;i++){
                    var row = rows[i];
                    result.push({
                        id_unite : row.id_unite,
                        libelle : row.libelle
                    });
                };

                console.log(result);
                res.json(result);
            });
        });

    });


// | POST | post data to DB |
//------------------------------------------------------------------------------
  router.route('/authentification').post(jsonParser, function (req, res) {
        req.getConnection(function (err, conn) {
            console.log(req.session);

            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);      // JSON req

            //construction de la query

            var getQuery = 'SELECT id, fonction FROM zs_utilisateur WHERE identifiant = "' + req.body.username + '" AND mot_de_passe ="' + req.body.password+ '"';
            var query = conn.query(getQuery, function (err, rows) {

                if (err) {

                    console.log(err);
                    res.status(500).send(err);
                }
                var data = (rows.length > 0);
                var result = {};
                result.connexion = data;
                if(data){
                    result.id = rows[0].id;
                    req.session.user = "user";
                    req.session.id_user = result.id;
                    result.fonction = rows[0].fonction;
                }
                console.log(result);
                res.json(result);

            });

        });

    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        console.log("$$$$$$$$$$$$$$$$ SESSIONS$$$$$$$$$$$$$$");
        console.log(req.session);
        if (req.session.user == "user")
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};


