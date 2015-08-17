/**
 * Created by Thomas on 17/08/2015.
 */
(function () {
    var ZSajoutHoraire = angular.module('ajoutHoraireApp', []);

    ZSajoutHoraire.controller('ajoutHoraireCtrl', ['$scope', '$http',
        function ($scope, $http) {
            $scope.sendFile = function(){
                var fd = new FormData();
                fd.append('file', $scope.file);
                $http.post("/ace/ajoutHoraires/send", fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function(){
                    })
                    .error(function(){
                    });

                /*function() {
                //$files: an array of files selected, each file has name, size, and type.
                console.log($scope.file);
                var req = {
                    method: 'POST',
                    url: '/send',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: { file: $scope.file}

                }

                $http(req).then(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });*/

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
                    console.log($scope.fileread);
                    console.log($scope.file);
                    //reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);


})();
