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

    router.get('/ace/ajoutHoraires/send',isLoggedIn , function(req,res){
        require('../script/excel_reader.js')(req,res,1);
    });

    router.get('/ace/ajoutHoraires', isLoggedIn, function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/ACE/ajoutHoraires.html'));
    });

    router.post('/infos_retard', isLoggedIn, function (req, res){
        req.session.id_train = req.body.id_train;
    });

    router.get('/infos_retard', isLoggedIn, function (req, res){
        res.sendFile(path.resolve(__dirname + '/../views/infos_retard.html'));
    });


    router.get('/unites', isLoggedIn, function(req, res){
        req.getConnection(function (err, conn) {
            if (err) return console.log('Connection fail: ' + err);
            console.log(req.body);

            var getQuery = 'SELECT DISTINCT zs_unite.libelle as libelle_unite, id_retard, zs_unite.id_unite, zs_cause_retard.libelle as libelle_motif FROM zs_cause_retard RIGHT JOIN zs_unite ON zs_cause_retard.id_unite = zs_unite.id_unite';
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

    router.get('/trains', isLoggedIn, function(req, res){
        req.getConnection(function (err, conn) {
            if (err) return console.log('Connection fail: ' + err);

            var date_min = new Date();
            date_min.setHours(date_min.getHours()-12);
            date_min.setMinutes(date_min.getMinutes()-date_min.getTimezoneOffset());
            var date_max = new Date();
            date_max.setHours(date_max.getHours()+1);
            date_max.setMinutes(date_max.getMinutes()-date_max.getTimezoneOffset());

            var string_date_min = date_min.toISOString();
            string_date_min = string_date_min.split("T");
            string_date_min = string_date_min[0] +" "+string_date_min[1];
            string_date_min = string_date_min.split(".")[0];

            var string_date_max = date_max.toISOString();
            string_date_max = string_date_max.split("T");
            string_date_max = string_date_max[0] +" "+string_date_max[1];
            string_date_max = string_date_max.split(".")[0];

            var getQuery = 'SELECT ZSPT.id_train, ZST.num_train, ZSP.date, ZSP.id_prevision ' +
                'FROM zs_prevision_train ZSPT ' +
                'LEFT JOIN zs_prevision ZSP ON ZSPT.id_prevision = ZSP.id_prevision ' +
                'LEFT JOIN zs_train ZST ON ZSPT.id_train = ZST.id_train ' +
                'LEFT JOIN zs_historique ZSH ON ZSPT.id_prevision = ZSH.id_prevision ' +
                'WHERE ZSP.id_prevision NOT IN(SELECT id_prevision FROM zs_historique) ' +
                'AND ZSP.date BETWEEN TIMESTAMP("' + string_date_min + '") AND TIMESTAMP("' + string_date_max + '") ' +
                'AND ZSPT.second_train = 0 ' +
                'ORDER BY ZSP.date ASC';

            console.log(getQuery);
            console.log(date_max.getTimezoneOffset());
            var query = conn.query(getQuery, function(err, rows){
                if (err) {

                    console.log(err);
                    res.status(500).send(err);
                }

                res.json(rows);
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


