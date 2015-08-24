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
/*TODO pourquoi?????????????????????????????????*/
/*
router.post('/retard', isLoggedOD, function(req, res) {
    req.session.id_user = req.body.id_user;
});
*/
router.post('/infos_retard', isLoggedOD, function (req, res){
    req.session.id_prevision = req.body.id_prevision;
    console.log(req.session);
    res.status(200).send();
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

        Date.prototype.toString = function () {
            return this.getDate()+"/"+(this.getMonth()+1)+"/"+this.getFullYear();
        };
        Date.prototype.timeToString = function () {
            return this.getHours()+":"+this.getMinutes();
        };
        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
        };

        var aujourdhui = new Date();
        var debut_periode = new Date();
        var fin_periode = new Date();
        debut_periode.addHours(-12);
        fin_periode.addHours(1);
        var sous_requete = "";
        var between = "";
        if(aujourdhui.getDate() == debut_periode.getDate()){
            between ='' +
                'ZSP.heure BETWEEN ' +
                'TIME_FORMAT("' + debut_periode.timeToString() + '","%H:%i") ' +
                'AND TIME_FORMAT("' + fin_periode.timeToString() + '","%H:%i") ';
            sous_requete =
                "SELECT " +
                    "id_prevision " +
                "FROM " +
                    "zs_historique " +
                "WHERE " +
                    "date = DATE_FORMAT('"+debut_periode.toString()+"','%d/%m/%Y')"
        }
        else{
            between ='' +
                '(ZSP.heure BETWEEN ' +
                    'TIME_FORMAT("' + debut_periode.timeToString() + '","%H:%i") ' +
                    'AND TIME_FORMAT("23:59","%H:%i") ' +
                'OR ' +
                    'ZSP.heure BETWEEN ' +
                    'TIME_FORMAT("00:00","%H:%i") ' +
                    'AND TIME_FORMAT("' + fin_periode.timeToString() + '","%H:%i")) ';
            sous_requete =
                "SELECT " +
                    "zs_historique.id_prevision " +
                "FROM " +
                    "zs_historique " +
                "LEFT JOIN " +
                    "zs_prevision " +
                    "ON zs_prevision.id_prevision = zs_historique.id_historique " +
                "WHERE " +
                    "ZSPT.id_prevision = zs_historique.id_prevision " +
                    "AND " +
                        "(date = DATE_FORMAT('"+debut_periode.toString()+"','%d/%m/%Y')" +
                        "and " +
                            "zs_prevision.heure > TIME_FORMAT('"+debut_periode.timeToString()+"','%H:%i'))" +
                        "OR" +
                        "(date = CURDATE())";
        }
        var getQuery = '' +
            'SELECT ' +
                'ZST.num_train, ' +
                'ZSP.heure, ' +
                'ZSP.id_prevision ' +
            'FROM ' +
                'zs_prevision_train ZSPT ' +
            'LEFT JOIN ' +
                'zs_prevision ZSP ' +
                'ON ZSPT.id_prevision = ZSP.id_prevision ' +
            'LEFT JOIN ' +
                'zs_train ZST ' +
                'ON ZSPT.id_train = ZST.id_train ' +
            'LEFT JOIN ' +
                'zs_historique ZSH ' +
                'ON ZSPT.id_prevision = ZSH.id_prevision ' +
            'WHERE ' +
                /*TODO a faire...*/
               /* 'NOT EXISTS (' +
                sous_requete +
                ')' +
                'AND ' +*/
                    'ZSPT.second_train = 0 ' +
                'AND ' +
                    between +
                'ORDER BY ' +
                    'ZSP.heure ASC';
        console.log(sous_requete);
        console.log(getQuery);
        var query = conn.query(getQuery, function(err, rows){
            if (err) {
                res.status(500).send(err);
            }
            console.log(rows)
            var result = [];
            for(var i=0; i<rows.length; i++){
                var heure = rows[i].heure.split(':');
                var infoTrain =rows[i].num_train +" - (" + heure[0]+":"+heure[1] + ")";
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
        console.log("+++++++++++++++");
        console.log(req.session);
        Date.prototype.toString = function () {
            return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear() ;
        };
        var date = new Date();
        var commentaire = req.body.commentaire;
        var postQuery = 'INSERT INTO zs_historique (id_OD, id_prevision, id_cause_retard, date, retard, commentaire) ' +
            'VALUES (' + req.session.id_user + ',' + req.session.id_prevision + ',' + req.body.id_motif + ',STR_TO_DATE("08-24-2015","%m-%d-%Y"), 1,' + req.body.commentaire + ')';
    console.log(postQuery);
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
    else if(req.session.user == "ACE")
        res.redirect('/ace');
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;