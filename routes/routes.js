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

    router.get('/retard', isLoggedIn, function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/retard.html'));
    });

    router.get('/ace/historique', isLoggedIn, function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/ACE/ace_historique.html'));
    });

    router.get('/ace/ajoutHorraires', isLoggedIn, function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/ACE/ajoutHorraires.html'));
    });

    router.get('/infos_retard', isLoggedIn, function (req, res){
        res.sendFile(path.resolve(__dirname + '/../views/infos_retard.html'));

    });

    router.get('/unites', isLoggedIn, function(req, res){
        req.getConnection(function (err, conn) {
            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);

            var getQuery = 'SELECT DISTINCT zs_unite.libelle as libelle_unite, id_retard, zs_cause_retard.id_unite, zs_cause_retard.libelle as libelle_motif FROM zs_cause_retard LEFT JOIN zs_unite ON zs_cause_retard.id_unite = zs_unite.id_unite';
            var query = conn.query(getQuery, function(err, rows){
                if (err) {

                    console.log(err);
                    res.status(500).send(err);
                }
                var result = [];

                for(var i=0;i<rows.length;i++){
                    var row = rows[i];
                    var bool = false;
                    for(var j= 0; j<result.length;j++){
                        if(result[j].id_unite == row.id_unite){
                            bool = true;
                            result[j].motif.push({
                                id_retard : row.id_retard,
                                libelle_motif : row.libelle_motif
                            });
                        };
                    };
                    if(!bool){
                      result.push({
                         id_unite : row.id_unite,
                          libelle_unite : row.libelle_unite,
                          motif : [{
                              id_retard : row.id_retard,
                              libelle_motif : row.libelle_motif
                          }]
                      });
                    };
                };
                res.json(result);
            });
        });
    });

    router.get('/motifs', isLoggedIn, function(req, res){
        req.getConnection(function (err, conn) {
            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);

            var getQuery = 'SELECT id_retard, id_unite, libelle FROM zs_cause_retard';
            var query = conn.query(getQuery, function(err, rows){
                if (err) {

                    console.log(err);
                    res.status(500).send(err);
                }
                var result = [];

                for(var i=0;i<rows.length;i++){
                    var row = rows[i];
                    result.push({
                        id_retard: row.id_retard,
                        id_unite : row.id_unite,
                        libelle : row.libelle
                    });
                };

                res.json(result);
            });
        });
    });



// | POST | post data to DB |
//------------------------------------------------------------------------------
    router.route('/authentification').post(jsonParser, function (req, res) {
        req.getConnection(function (err, conn) {

            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);      // JSON req

            //construction de la query

            var getQuery = 'SELECT id_utilisateur , fonction FROM zs_utilisateur WHERE identifiant = "' + req.body.username + '" AND mot_de_passe ="' + req.body.password+ '"';
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

                res.json(result);

            });

        });

    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on

        if (req.session.user == "user")
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};


