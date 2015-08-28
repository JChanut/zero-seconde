/**
 * Created by Thomas on 19/08/2015.
 */
var express = require('express'),
    path = require('path'),
    router = express.Router(),
    multiparty = require('multiparty');

//==============================================================================
//                 Partie ACE
//==============================================================================


router.get('/histo', isLoggedACE, function(req, res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT DISTINCT ZSH.id_historique, ZST.num_train, CONCAT(ZSU.nom," ",ZSU.prenom) AS identite, ZSH.retard, ZSH.etat, ZSH.id_prevision, ZSCR.id_unite, ZSCR.id_retard, ZSH.commentaire, ZSH.duree_retard' +
            ' FROM zs_historique ZSH' +
            ' LEFT JOIN zs_cause_retard ZSCR ON ZSH.id_retard = ZSCR.id_retard' +
            ' LEFT JOIN zs_utilisateur ZSU ON ZSH.id_od = ZSU.id_utilisateur' +
            ' LEFT JOIN zs_prevision ZSP ON ZSH.id_prevision = ZSP.id_prevision' +
            ' LEFT JOIN zs_prevision_train ZSPT ON ZSH.id_prevision = ZSPT.id_prevision' +
            ' LEFT JOIN zs_train ZST ON ZSPT.id_train = ZST.id_train' +
            ' WHERE ZSPT.second_train = 0' +
            ' AND ZSH.etat <> "attente"';

        console.log(getQuery);
        var query = conn.query(getQuery, function(err, rows){
            if (err) {
                res.status(500).send(err);
            }

            res.json(rows);
        });
    });
});

router.put('/histo/send', isLoggedACE, function(req,res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);
        var commentaire = req.body.commentaire;
        commentaire = (commentaire==null)?commentaire:"'"+commentaire+"'";
        var putQuery = "UPDATE zs_historique" +
            " SET id_ACE=" + req.session.id_user + ", id_prevision=" + req.body.id_prevision + ", id_retard=" +
            req.body.id_retard + ", retard=" + req.body.retard + ", duree_retard=" + req.body.duree_retard + ", commentaire=" +
            commentaire + " WHERE id_historique=" + req.body.id_historique;

        console.log(putQuery);
        var query = conn.query(putQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }
        });
    });

});

router.get('/histo/unite', isLoggedACE, function(req,res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var putQuery = "SELECT id_unite, libelle FROM zs_unite";

        console.log(putQuery);
        var query = conn.query(putQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        });
    });
});

router.get('/histo/cause_retard', isLoggedACE, function(req,res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var putQuery = "SELECT id_retard, zs_cause_retard.libelle , zs_cause_retard.id_unite AS dependance FROM zs_cause_retard LEFT JOIN zs_unite ON zs_cause_retard.id_unite = zs_unite.id_unite";

        console.log(putQuery);
        var query = conn.query(putQuery, function(err, rows) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(rows);
        });
    });
});

router.post('/ajoutHoraires/send',isLoggedACE , function(req,res){
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        if(err)console.log(err);
        else {
            if (files.file[0])
                require('../script/excel_reader.js')(req, res,  files.file[0].path);
        }
    });
});

//==============================================================================
//               Vérification authentification
//==============================================================================
function isLoggedACE(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.session.user == "ACE")
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;