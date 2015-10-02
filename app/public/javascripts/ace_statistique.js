/**
 * Created by Thomas on 19/08/2015.
 */
(function () {
    var ZSajoutHoraire = angular.module('zeroSecApp', []);

    ZSajoutHoraire.controller('statistiqueCtrl', ['$scope', '$http',
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
                    })
                    .error(function(){
                    });
            }
        }
    ]);
})();