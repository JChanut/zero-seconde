/**
 * Created by Alan on 30/07/2015.
 */
var db = require('bdd.js');

auth = function(username, password) {
    db.connect();
    return db.SQLcheckLogin(username, password);
};

