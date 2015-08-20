/**
 * Created by Thomas on 19/08/2015.
 */
var express = require('express'),
    path = require('path'),
    router = express.Router();


//==============================================================================
//               Parti OD
//==============================================================================
router.get('/',isLoggedOD,function(req,res) {
    res.sendFile(path.resolve(__dirname + '/../views/OD/menu.html'));
});

router.get('/retard', isLoggedOD, function (req, res){
    res.sendFile(path.resolve(__dirname + '/../views/OD/retard.html'));
});

router.post('/retard', isLoggedOD, function(req, res) {
    req.session.id_user = req.body.id_user;
});

router.post('/infos_retard', isLoggedOD, function (req, res){
    req.session['id_prevision'] = req.body.id_prevision;
});

router.get('/infos_retard', isLoggedOD, function (req, res){
    res.sendFile(path.resolve(__dirname + '/../views/OD/infos_retard.html'));
});


router.get('/unites', isLoggedOD, function(req, res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT DISTINCT zs_unite.libelle as libelle_unite, id_retard, zs_unite.id_unite, zs_cause_retard.libelle as libelle_motif FROM zs_cause_retard RIGHT JOIN zs_unite ON zs_cause_retard.id_unite = zs_unite.id_unite';
        var query = conn.query(getQuery, function(err, rows){
            if (err) {
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

router.get('/trains', isLoggedOD, function(req, res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var date_min = new Date();
        date_min.setHours(date_min.getHours()-10);
        date_min.setMinutes(date_min.getMinutes()-date_min.getTimezoneOffset());
        var date_max = new Date();
        date_max.setHours(date_max.getHours()+3);
        date_max.setMinutes(date_max.getMinutes()-date_max.getTimezoneOffset());

        var string_date_min = date_min.toISOString();
        string_date_min = string_date_min.split("T");
        string_date_min = string_date_min[0] +" "+string_date_min[1];
        string_date_min = string_date_min.split(".")[0];

        var string_date_max = date_max.toISOString();
        string_date_max = string_date_max.split("T");
        string_date_max = string_date_max[0] +" "+string_date_max[1];
        string_date_max = string_date_max.split(".")[0];

        var getQuery = 'SELECT ZST.num_train, ZSP.date, ZSP.id_prevision ' +
            'FROM zs_prevision_train ZSPT ' +
            'LEFT JOIN zs_prevision ZSP ON ZSPT.id_prevision = ZSP.id_prevision ' +
            'LEFT JOIN zs_train ZST ON ZSPT.id_train = ZST.id_train ' +
            'LEFT JOIN zs_historique ZSH ON ZSPT.id_prevision = ZSH.id_prevision ' +
            'WHERE ZSP.id_prevision NOT IN(SELECT id_prevision FROM zs_historique) ' +
            'AND ZSP.date BETWEEN TIMESTAMP("' + string_date_min + '") AND TIMESTAMP("' + string_date_max + '") ' +
            'AND ZSPT.second_train = 0 ' +
            'ORDER BY ZSP.date ASC';

        var query = conn.query(getQuery, function(err, rows){
            if (err) {
                res.status(500).send(err);
            }
            var result = [];
            for(var i=0; i<rows.length; i++){
                var date = rows[i].date;
                date = date.toISOString();
                date = date.split('T');
                date = date[1];
                date = date.split(':');
                date = date[0] + ':' + date[1];
                var infoTrain ="(" +date + ") - " + rows[i].num_train;
                result.push({
                    id_prevision : rows[i].id_prevision,
                    infoTrain : infoTrain
                });
            }
            res.json(result);
        });
    });
});


router.post('/post_retard', isLoggedOD, function(req, res) {
    req.getConnection(function(err, conn){
        if(err) return console.log('Connection fail: ' + err);
        var postQuery = 'INSERT INTO zs_historique (id_OD, id_prevision, id_retard, retard, commentaire) ' +
            'VALUES (' + req.session.id_user + ',' + req.session.id_prevision + ',' + req.body.id_motif + ', 1,"' + req.body.commentaire + '")';

        var query = conn.query(postQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }

        });

    });
});

router.post('/danslestemps', isLoggedOD, function(req, res) {
    req.getConnection(function(err, conn){
        if(err) return console.log('Connection fail: ' + err);
        req.session['id_prevision'] = req.body.id_prevision;
        var postQuery = 'INSERT INTO zs_historique (id_OD, id_prevision, retard) ' +
            'VALUES (' + req.session.id_user + ',' + req.session.id_prevision + ', 0)';

        var query = conn.query(postQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }

        });

    });
});

//==============================================================================
//               Verification de la connexion
//==============================================================================
function isLoggedOD(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.session.user == "OD")
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;