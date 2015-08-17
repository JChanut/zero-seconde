/**
 * Created by Thomas on 17/08/2015.
 */
(function () {
    var ZSajoutHoraire = angular.module('ajoutHoraireApp', []);

    ZSajoutHoraire.controller('ajoutHoraireCtrl', ['$scope', '$http',
        function ($scope, $http) {
            $scope.onFileSelect = function(   ) {
                //$files: an array of files selected, each file has name, size, and type.
                console.log($files);
                for (var i = 0; i < $files.length; i++) {
                    var $file = $files[i];
                    Upload.upload({
                        url: 'my/upload/url',
                        file: $file,
                        progress: function(e){}
                    }).then(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                    });
                }
            }
        }]);
})();
