/**
 * Created by Thomas on 17/08/2015.
 */
(function () {
    var ZSajoutHoraire = angular.module('zeroSecApp', []);

    ZSajoutHoraire.controller('ajoutHoraireCtrl', ['$scope', '$http',
        function ($scope, $http) {
            $scope.sendFile = function(){
                var fd = new FormData();
                console.log($scope.file);
                fd.append('file', $scope.file);
                $http.post("/ace/ajoutHoraires/send", fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function(){
                        Materialize.toast("L'envoie a &eacute;t&eacute; effectu&eacute; !", 3000);
                    })
                    .error(function(){
                        Materialize.toast("L'envoie a &eacute;chou&eacute; !", 3000);
                    });
            }
        }]);

    ZSajoutHoraire.directive("fileread", [function () {
        return {
            $scope: {
                fileread: "="
            },
            link: function ($scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        $scope.$apply(function () {
                            $scope.fileread = loadEvent.target.result;
                        });
                    };
                    $scope.file = changeEvent.target.files[0];
                    //reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);


})();
