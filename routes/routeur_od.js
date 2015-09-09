/**
 * Created by Thomas on 19/08/2015.
 */
var express = require('express'),
    path = require('path'),
    router = express.Router();


//==============================================================================
//               Parti OD
//==============================================================================

router.post('/infos_retard', isLoggedOD, function (req, res){
    req.session.id_prevision = req.body.id_prevision;
    console.log(req.session);
    res.status(200).send();
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
            var mois = this.getMonth()+1;
            if(mois<10)
                mois = "0"+mois.toString();
            return this.getFullYear()+"-"+mois+"-"+this.getDate();
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
                "SELECT DISTINCT " +
                    "ZSP.id_prevision " +
                "FROM " +
                    "zs_prevision ZSP " +
                "INNER JOIN " +
                    "zs_historique ZSH " +
                    "ON ZSP.id_prevision = ZSH.id_prevision " +
                "WHERE " +
                    "date = DATE_FORMAT('"+debut_periode.toString()+"','%Y-%m-%d') " +
                    "AND " +
                        "ZSH.etat != 'attente'";
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
                "SELECT DISTINCT " +
                    "ZSH.id_prevision " +
                "FROM " +
                    "zs_prevision ZSP " +
                "INNER JOIN " +
                    "zs_historique ZSH " +
                    "ON ZSP.id_prevision = ZSH.id_historique " +
                "WHERE " +
                    "ZSP.id_prevision = ZSH.id_prevision " +
                    "AND " +
                        "ZSH.etat != 'attente'" +
                    "AND " +
                        "(date = DATE_FORMAT('"+debut_periode.toString()+"','%Y-%m-%d') " +
                        "and " +
                            "ZSP.heure > TIME_FORMAT('"+debut_periode.timeToString()+"','%H:%i')) " +
                        "OR " +
                        "(date = CURDATE())";
        }
        var getQuery = '' +
            'SELECT DISTINCT ' +
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
                'ZSP.id_prevision NOT IN (' +
                sous_requete +
                ')' +
                'AND ' +
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

            var result = [];
            var hier = false;
            var rang = 0;
            console.log(rows);
            console.log(rows.length);
            for(var i=0; i<rows.length; i++){
                console.log(i + " "+!hier);
                var heure = rows[i].heure.split(':');
                var date = new Date();
                date.setHours(heure[0]);
                date.setMinutes(heure[1]);
                var current = new Date();
                current.setTime(current.getTime() + (60*60*1000));
                if(date<=current) {
                    var infoTrain = rows[i].num_train + " - (" + heure[0] + ":" + heure[1] + ")";
                    result.push({
                        id_prevision: rows[i].id_prevision,
                        infoTrain: infoTrain
                    });
                }
                else {
                    hier = true;
                    rang = i-1;
                    break;
                }
            }
            if(hier)
                for(i=rows.length-1;i>rang;i--){
                    var heure = rows[i].heure.split(':');
                    var date = new Date();
                    date.setHours(heure[0]);
                    date.setMinutes(heure[1]);
                    var current = new Date();
                    current.setTime(current.getTime() + (60*60*1000));
                    var infoTrain = rows[i].num_train + " - (" + heure[0] + ":" + heure[1] + ")";
                    result.unshift({
                        id_prevision: rows[i].id_prevision,
                        infoTrain: infoTrain
                    });
                }
            res.json(result);
        });
    });
});

router.post('/post_retard', isLoggedOD, function(req, res) {
    req.getConnection(function(err, conn){
        if(err) return console.log('Connection fail: ' + err);

        Date.prototype.toString = function () {
            return (this.getMonth()+1) +"-"+this.getDate()+"-"+this.getFullYear() ;
        };
        var date = new Date();
        var commentaire = req.body.commentaire;
        var postQuery = 'INSERT INTO zs_historique (id_OD, id_prevision, id_retard, date, etat, retard, commentaire) ' +
            'VALUES (' + req.session.id_user + ',' + req.session.id_prevision + ',' + req.body.id_motif + ',STR_TO_DATE("'+ date.toString() +'","%m-%d-%Y"), "ok", 1,"' + req.body.commentaire + '")';
        var query = conn.query(postQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.end();
            }

        });

    });
});

router.post('/danslestemps', isLoggedOD, function(req, res) {
    req.getConnection(function(err, conn){
        if(err) return console.log('Connection fail: ' + err);
        req.session['id_prevision'] = req.body.id_prevision;
        Date.prototype.toString = function () {
            return (this.getMonth()+1) +"-"+this.getDate()+"-"+this.getFullYear() ;
        };
        var date = new Date();
        var postQuery = 'INSERT INTO zs_historique (id_OD, id_prevision, retard, date, etat) ' +
            'VALUES (' + req.session.id_user + ',' + req.session.id_prevision + ', 0 ,STR_TO_DATE("'+ date.toString() +'","%m-%d-%Y"),"ok")';

        console.log(postQuery);
        var query = conn.query(postQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.end();
            }

        });

    });
});

router.post('/annule', isLoggedOD, function(req, res) {
    req.getConnection(function(err, conn){
        if(err) return console.log('Connection fail: ' + err);
        req.session['id_prevision'] = req.body.id_prevision;
        Date.prototype.toString = function () {
            return (this.getMonth()+1) +"-"+this.getDate()+"-"+this.getFullYear() ;
        };
        var date = new Date();
        var postQuery = 'INSERT INTO zs_historique (id_OD, id_prevision, retard, date, etat) ' +
            'VALUES (' + req.session.id_user + ',' + req.session.id_prevision + ', 0 ,STR_TO_DATE("'+ date.toString() +'","%m-%d-%Y"),"ko")';

        console.log(postQuery);
        var query = conn.query(postQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.end();
            }

        });

    });
});

//==============================================================================
//               PARTIE LIEE AUX STATISTIQUES
//==============================================================================
// DATE DU JOUR FORMAT YYYY-MM-DD
var rightNow = new Date();
var DDJ = rightNow.toISOString().slice(0,10).replace(/-/g,"-");

// DATE DU JOUR - 1
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
var DDH = yesterday.toISOString().slice(0,10).replace(/-/g,"-");

router.get('/statODalheure', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(ZSH.id_historique) AS NbalHeure ' +
            'FROM zs_historique ZSH LEFT JOIN zs_prevision ZSP ON ZSH.id_prevision = ZSP.id_prevision ' +
            'WHERE ZSH.retard = 0 AND ZSH.etat="ok" AND ZSP.id_gare = 1 AND ZSH.date="' + DDJ + '"';

        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});


router.get('/statODalheureAgent', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbalHeureAgent FROM zs_historique WHERE retard = 0 AND etat="ok" AND id_OD =' + req.session.id_user + ' AND date="' + DDJ + '"';
        console.log(DDH);
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODalheureHierAgent', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbalHeureHierAgent FROM zs_historique WHERE retard = 0 AND etat="ok" AND id_OD =' + req.session.id_user + ' AND date="' + DDH + '"';
        console.log(getQuery);
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODalheureHier', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbalHeureHier FROM zs_historique WHERE retard = 0 AND etat="ok" AND date="' + DDH + '"';
        console.log(getQuery);
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODalheureSemaine', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbalHeureSemaine FROM zs_historique WHERE retard = 0  AND etat="ok" AND WEEK(date) = WEEK("' + DDJ + '")';

        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);

        })
    });
});

router.get('/statODenRetard', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbenRetard FROM zs_historique WHERE retard = 1 AND date="' + DDJ + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODenRetardAgent', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbenRetardAgent FROM zs_historique WHERE retard = 1 AND id_OD =' + req.session.id_user + ' AND date="' + DDJ + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODenRetardHierAgent', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbenRetardHierAgent FROM zs_historique WHERE retard = 1 AND id_OD =' + req.session.id_user + ' AND date="' + DDH + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODenRetardHier', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbenRetardHier FROM zs_historique WHERE retard = 1 AND date="' + DDH + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODenRetardSemaine', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = "SELECT COUNT(id_historique) AS NbenRetardSemaine FROM zs_historique WHERE retard = 1 AND WEEK(date) = WEEK('" + DDJ + "')";
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODannuleAgent', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT COUNT(id_historique) AS NbannuleAgent FROM zs_historique WHERE etat="ko" AND id_OD =' + req.session.id_user + ' AND date="' + DDJ + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
    });
});

router.get('/statODtotalTrain', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var rightNow = new Date();
        var DDJ = rightNow.toISOString().slice(0,10).replace(/-/g,"-");

        var getQuery = 'SELECT COUNT(ZSH.id_historique) AS NbTotalTrain FROM zs_historique ZSH LEFT JOIN zs_prevision ZSP ' +
            'ON ZSH.id_prevision = ZSP.id_prevision WHERE date ="' + DDJ + '" AND etat="ok" AND ZSP.id_gare = 1';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
        console.log(getQuery);
    });
});

router.get('/statODtotalTrainHier', isLoggedOD, function(req, res){
    req.getConnection(function(err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var rightNow = new Date();
        var DDJ = rightNow.toISOString().slice(0,10).replace(/-/g,"-");

        var getQuery = 'SELECT COUNT(id_historique) AS NbTotalTrain FROM zs_historique WHERE date ="' + DDH + '"';
        var query = conn.query(getQuery, function (err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        })
        console.log(getQuery);
    });
});


//==============================================================================
//               Verification de la connexion
//==============================================================================
function isLoggedOD(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.session.user != "guest")
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;