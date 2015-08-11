/**
 * Created by Thomas on 07/08/2015.
 */
module.exports = function(req,res) {
    var Excel = require('exceljs');
    var path = require('path');

    console.log("********** PARSEUR XLSX **********");
    var workbook = new Excel.Workbook();
    var $i = 8;
    var prevision = [];
    workbook.xlsx.readFile(path.resolve(__dirname + '../../../tst_14_12_2014_00_00_00___12_12_2015_00_00_00.xlsx'))
        .then(function() {
            // use workbook
            var worksheet = workbook.getWorksheet("TST");
            var sortir = false;
            while(!sortir) {
                var row = worksheet.getRow($i);

                var num_train = row.values[1];
                if(num_train != undefined && num_train.length > 0) {
                    var num_parite = row.values[2];
                    if (num_parite == undefined || num_parite.length == 0)
                        num_parite = null;
                    var date = new Date();
                    var heure = row.values[7].toString().split(':');
                    date.setHours(heure[0]);
                    date.setMinutes(heure[1]);

                    prevision.push({
                        train : num_train,
                        parite : num_parite,
                        date: date,
                        id_train : null,
                        id_parite : null,
                        id_prevision : null
                    });
                    $i++;

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

            function Data_excel(req,res,data,id_gare) {
                this.data = data;
                this.req = req;
                this.res = res;
                this.first = true;
                this.rang = 0;
                this.id_gare = id_gare;
            };

            Data_excel.prototype.setTrain = function(){
                var train = (this.first)? this.data[this.rang].train : this.data[this.rang].parite;
                var getQuery = 'INSERT INTO zs_train  (num_train) VALUES ('+train+')';

                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                        else
                            this.getTrain();
                    });
                });
            };

            Data_excel.prototype.getTrain = function(){
                var train = (this.first)? this.data[this.rang].train : this.data[this.rang].parite;
                var getQuery =  'SELECT id_train FROM zs_train WHERE num_train = '+train;

                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                        else
                        {
                            if(rows.length == 0)
                                this.setTrain();
                            else {
                                if(this.first){
                                    this.data[this.rang].id_train = rows[0].id_train;
                                    if(this.data[this.rang].parite == null) {
                                        this.setPrevision();
                                    }
                                    else{
                                        this.first = false;
                                        this.getTrain();
                                    }
                                }
                                else {
                                    this.data[this.rang].id_parite = rows[0].id_train;
                                    this.setPrevision();
                                }
                            }
                        }
                    });
                });
            };

            Data_excel.prototype.setPrevision = function(){
                var getQuery = 'INSERT INTO zs_prevision (id_gare, date) VALUES ('+this.id_gare+','+this.data[this.rang].date+')';
                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                        else {
                            this.getPrevision();
                        }
                    });
                });
            };

            Data_excel.prototype.getPrevision = function(){
                var getQuery = 'SELECT max(id_prevision) AS id_prevision FROM zs_prevision WHERE id_gare ='+this.id_gare;

                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                        else{
                            this.data[this.rang].id_prevision = rows[0].id_prevision;
                            this.makeLinkTrainPrevision();
                        }
                    });
                });
            };

            Data_excel.prototype.makeLinkTrainPrevision = function(){
                var id_train = this.data[this.rang].id_train;
                var id_parite = this.data[this.rang].id_parite;
                var id_prevision = this.data[this.rang].id_prevision;
                var getQuery = 'INSERT INTO zs_prevision_train (id_prevision,id_train,second_train) VALUES ('+id_prevision+','+id_train+',false)';
                if(id_parite != null)
                    getQuery += ' ('+id_prevision+','+id_parite+',true)';

                req.getConnection(function (err, conn) {

                    if (err) return console.log('Connection fail: ' + err);
                    var query = conn.query(getQuery, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                        else {
                            this.rang++;
                            this.first = true;
                            if(this.rang < this.data.length) {
                                this.getTrain();
                            }
                        }
                    });
                });
            };
        }
    );
};