/**
 * Created by Alan on 11/08/2015.
 */
(function () {
    var ZStrainData = angular.module('zeroSecApp', []);

    ZStrainData.controller('trainDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            var url_get = '/od/trains';
            var url_post = '/od/infos_retard';
            var url_post_alheure = '/od/danslestemps';

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
                console.log(train);
            };

            $scope.postTrain = function() {
                if(train != null){
                    data = {
                        id_prevision : train.id_prevision
                    };
                    setTimeout(function () {
                        $http.post(url_post, data);
                        window.location.href = '/od/infos_retard'
                    }, 1000);
                }

            }

            $scope.postTrainAlheure = function() {
                if(train != null){
                    data = {
                        id_prevision : train.id_prevision
                    };
                    Materialize.toast("Le train a bien &eacute;t&eacute; d&eacute;clar&eacute; 	&agrave; l'heure. Vous allez &ecirc;tre redirig&eacute;", 3000)
                    setTimeout(function () {
                        $http.post(url_post_alheure, data);
                        window.location.href = '/od'
                    }, 5000);
                }
            }
        }]);

})();