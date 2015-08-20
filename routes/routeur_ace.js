/**
 * Created by Thomas on 19/08/2015.
 */
var express = require('express'),
    path = require('path'),
    router = express.Router(),
    multiparty = require('multiparty');

//==============================================================================
//               Parti ACE
//==============================================================================

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', isLoggedACE, function (req, res){
    console.log(path.resolve(__dirname + '/../views/ACE/menu.html'));
    res.sendFile(path.resolve(__dirname + '/../views/ACE/menu.html'));
});

router.get('/historique', isLoggedACE, function (req, res){
    res.sendFile(path.resolve(__dirname + '/../views/ACE/ace_historique.html'));
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

router.get('/ajoutHoraires', isLoggedACE, function (req, res){
    res.sendFile(path.resolve(__dirname + '/../views/ACE/ajoutHoraires.html'));
});

router.get('/stat', isLoggedACE, function (req, res){
    res.sendFile(path.resolve(__dirname + '/../views/ACE/statistique.html'));
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