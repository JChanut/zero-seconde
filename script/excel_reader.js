/**
 * Created by Thomas on 07/08/2015.
 */
module.exports = function(app) {
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
                    if (num_parite.length == 0)
                        num_parite = null;
                    var date = new Date();
                    var heure = row.values[7].toString().split(':');
                    date.setHours(heure[0]);
                    date.setMinutes(heure[1]);

                    prevision.push({
                        train : num_train,
                        parite : num_parite,
                        date: date
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

            var getTrain = function(data,rang,first){};
            var setTrain = function(data,rang){};
            var setPrevision = function(data,rang){};

            getTrain = function(data,rang,first){
                  var train = (first)? data[rang].train : data[rang].parite;
                var getQuery =  'SELECT id_train FROM zs_train WHERE num_train = '+train;
            };
        }
    );
};