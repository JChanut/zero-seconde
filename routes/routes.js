/**
 * Created by Thomas on 05/08/2015.
 */
module.exports = function(app, router, jsonParser) {

    var path = require('path');

    app.use('/',router);
    router.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../views/index.html'));
    });

    router.get('/retard', function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/retard.html'));
    });

    router.get('/ace/historique', function (req, res){

        res.sendFile(path.resolve(__dirname + '/../views/ACE/ace_historique.html'));
    });





// | POST | post data to DB |
//------------------------------------------------------------------------------
  router.route('/authentification').post(jsonParser, function (req, res) {
        req.getConnection(function (err, conn) {

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
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};


