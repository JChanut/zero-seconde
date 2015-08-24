/**
 * Created by Thomas on 19/08/2015.
 */
var express = require('express'),
    path = require('path'),
    router = express.Router(),
    multiparty = require('multiparty');

//==============================================================================
//               Partie ACE
//==============================================================================


router.get('/histo', isLoggedOD, function(req, res){
    req.getConnection(function (err, conn) {
        if (err) return console.log('Connection fail: ' + err);

        var getQuery = 'SELECT DISTINCT zs_unite.libelle as libelle_unite, id_retard, zs_unite.id_unite, zs_cause_retard.libelle as libelle_motif FROM zs_cause_retard RIGHT JOIN zs_unite ON zs_cause_retard.id_unite = zs_unite.id_unite';
        var query = conn.query(getQuery, function(err, rows){
            if (err) {
                res.status(500).send(err);
            }
            var result = [];


            res.json(result);
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
    else if(req.session.user == "OD")
        res.redirect('/od');
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;