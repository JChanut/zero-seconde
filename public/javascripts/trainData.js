/**
 * Created by Alan on 11/08/2015.
 */
(function () {
    var ZStrainData = angular.module('trainDataApp', []);

    ZStrainData.controller('trainDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            var url_get = '/trains';
            var url_post = '/infos_retard';

            var train = null;
            $scope.selected = {};


            //Méthode GET -> Récupérer et afficher les données
            $http.get(url_get).
                then(function(response) {
                    $scope.data = response.data;
                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

            $scope.getIdTrain = function () {
                train = $scope.selected.trains;
            };

            $scope.postTrain = function() {
                if(train != null){
                    data = {
                        id_prevision : train.id_prevision
                    };
                    setTimeout(function () {
                        $http.post(url_post, data);
                        window.location.href = '/infos_retard'
                    }, 1000);
                }

            }
        }]);

})();