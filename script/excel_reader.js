/**
 * Created by Thomas on 07/08/2015.
 */
module.exports = function(req,res,path_file) {
    var Excel = require('exceljs'),
        path = require('path');
    res.charset = 'utf-8';
    console.log("********** PARSEUR XLSX **********");
    var workbook = new Excel.Workbook();
    var i = 8;
    var prevision = [];
    workbook.xlsx.readFile(path.resolve(path_file))
        .then(function() {
            // use workbook
            var worksheet = workbook.getWorksheet("TST");
            var sortir = false;
            while(!sortir) {
                var row = worksheet.getRow(i);

                var num_train = row.values[1];
                if(num_train != undefined && num_train.length > 0) {
                    var num_parite = row.values[2];
                    if (num_parite == undefined || num_parite.length == 0)
                        num_parite = null;

                    var heure = row.values[7].toString();

                    prevision.push({
                        train : num_train,
                        parite : num_parite,
                        heure: heure,
                        id_train : null,
                        id_parite : null
                    });
                    i++;

                    /* SQL

                     'INSERT INTO zs_train  (num_train) VALUES ('+num_train+')'
                     'SELECT id_train FROM zs_train WHERE num_train = '+num_parite
                     'INSERT INTO zs_train  (num_train) VALUES ('+num_parite+')'

                     'INSERT INTO zs_prevision
                     */
                }
                else {
                    sortir = true;
                }
            }

            function Data_excel(req,res,data) {
                this.data = data;
                this.req = req;
                this.res = res;
                this.first = true;
                this.rang = 0;
                this.id_gare = req.session.id_gare;
            };

            Data_excel.prototype.setTrain = function(){
                var train = (this.first)? this.data[this.rang].train : this.data[this.rang].parite;
                var famille = null;
                var fc = /^(894|21907|21909|784533|809225|78495|784801)/;
                var bourgogne = /^(17|542099|839|860|875|8913|8915|8917|8919|8914|893|219|218|8918|784883|784633|784500|8918|54208|734908|734701)/;
                var rhalpes = /^(21986|21987|21756|21988|542080)/;
                //var intercite = /^(1543|1545)$/;
                //var tgv = /^([1-9][0-9]{3})$/;
                var sudest = /^(1435)/;
                var voyage = /^(68|67|21955|506)/;
                var champArdenne = /^(15|2197|2198|1194|8398)/;

                if(fc.exec(train)){
                    famille = "TER Franche Comté";
                }else if(bourgogne.exec(train)){
                    famille = "TER Bourgogne";
                }else if(rhalpes.exec(train)){
                    famille = "TER Rhône Alpes";
                }else if(sudest.exec(train)){
                    famille = "Téoz Sud Est";
                }else if(voyage.exec(train)){
                    famille = "Voyages";
                }else if(champArdenne.exec(train)){
                    famille = "TER Champagne Ardennes";
                }

                var getQuery = 'INSERT INTO zs_train  (num_train,famille) VALUES ('+train+',"'+ famille +'")';
                var current = this;
                console.log(getQuery);
                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log("setTrain"+err);
                            res.status(500).send(err);
                        }
                        else
                            current.getTrain();
                    });
                });
            };

            Data_excel.prototype.getTrain = function(){
                var train = (this.first)? this.data[this.rang].train : this.data[this.rang].parite;
                var getQuery =  'SELECT id_train FROM zs_train WHERE num_train = '+train;
                var current = this;
                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log("getTrain"+err);
                            res.status(500).send(err);
                        }
                        else
                        {
                            if(rows.length == 0)
                                current.setTrain();
                            else {
                                if(current.first){
                                    current.data[current.rang].id_train = rows[0].id_train;
                                    if(current.data[current.rang].parite == null) {
                                        current.setPrevision();
                                    }
                                    else{
                                        current.first = false;
                                        current.getTrain();
                                    }
                                }
                                else {
                                    current.data[current.rang].id_parite = rows[0].id_train;
                                    current.setPrevision();
                                }
                            }
                        }
                    });
                });
            };

            Data_excel.prototype.setPrevision = function(){

                var getQuery = 'INSERT INTO zs_prevision (id_gare, heure) VALUES ('+this.id_gare+',TIME_FORMAT("'+this.data[this.rang].heure+'","%H:%i"))';
                var current = this;
                //INSERT INTO `zero_sec`.`zs_prevision` (`id_prevision`, `id_gare`, `date`) VALUES (NULL, '1', TIMESTAMP('2015-08-31 00:00:00'));
                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log("setPrevision "+current.id_gare+" "+current.data[current.rang].date+" "+err);
                            res.status(500).send(err);
                        }
                        else {
                            current.getPrevision();
                        }
                    });
                });
            };

            Data_excel.prototype.getPrevision = function(){
                var getQuery = 'SELECT max(id_prevision) AS id_prevision FROM zs_prevision WHERE id_gare ='+this.id_gare;

                var current = this;

                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log("getPrevision "+err);
                            res.status(500).send(err);
                        }
                        else{
                            current.data[current.rang].id_prevision = rows[0].id_prevision;
                            current.makeLinkTrainPrevision();
                        }
                    });
                });
            };

            Data_excel.prototype.makeLinkTrainPrevision = function(){
                var id_train = this.data[this.rang].id_train;
                var id_parite = this.data[this.rang].id_parite;
                var id_prevision = this.data[this.rang].id_prevision;
                var getQuery = 'INSERT INTO zs_prevision_train (id_prevision,id_train,second_train) VALUES ('+id_prevision+','+id_train+',false)';
                var current = this;
                if(id_parite != null)
                    getQuery += ', ('+id_prevision+','+id_parite+',true)';

                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log("makeLinkTrainPrevision "+id_train+" "+id_parite+" "+id_prevision+" "+err);
                            res.status(500).send(err);
                        }
                        else {
                            current.rang++;
                            current.first = true;
                            if(current.rang < current.data.length) {
                                current.getTrain();
                            }
                            else {
                                var result = {
                                    good : "ok"
                                };
                                current.res.json(result);
                            }
                        }
                    });
                });
            };

            var ajout_bd = new Data_excel(req,res,prevision);
            ajout_bd.getTrain();
        }
    );
};