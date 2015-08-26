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

        var getQuery = 'SELECT DISTINCT ZSH.id_historique, ZST.num_train, ZSU.nom, ZSH.retard, ZSUN.libelle, ZSCR.libelle AS libelleCR, ZSH.commentaire, ZSH.duree_retard' +
            ' FROM zs_historique ZSH' +
            ' LEFT JOIN zs_cause_retard ZSCR ON ZSH.id_cause_retard = ZSCR.id_retard' +
            ' LEFT JOIN zs_utilisateur ZSU ON ZSH.id_od = ZSU.id_utilisateur' +
            ' LEFT JOIN zs_prevision ZSP ON ZSH.id_prevision = ZSP.id_prevision' +
            ' LEFT JOIN zs_prevision_train ZSPT ON ZSH.id_prevision = ZSPT.id_prevision' +
            ' LEFT JOIN zs_unite ZSUN ON ZSCR.id_unite = ZSUN.id_unite' +
            ' LEFT JOIN zs_train ZST ON ZSPT.id_train = ZST.id_train' +
            ' WHERE ZSPT.second_train = 0';

        console.log(getQuery);
        var query = conn.query(getQuery, function(err, rows){
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