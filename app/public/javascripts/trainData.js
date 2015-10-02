/**
 * Created by Alan on 11/08/2015.
 */
(function () {
    var ZStrainData = angular.module('zeroSecApp', []);

    ZStrainData.controller('trainDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            const URL_MENU = '/od';
            const URL_GET = '/od/trains';
            const URL_RETARD = '/od/infos_retard';
            const URL_ALHEURE = '/od/danslestemps';

            var train = null;
            $scope.selected = {};


            //Méthode GET -> Récupérer et afficher les données
            $http.get(URL_GET).
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
                    $http.post(URL_RETARD, data).
                        then(function(response) {
                            window.location.href = URL_RETARD;//'/od/infos_retard';
                        }, function(response) {
                            console.log(response);
                        });
                }else {
                    Materialize.toast("Vous n'avez pas saisie de train.", 3000);
                }

            }

            $scope.postTrainAlheure = function() {
                if(train != null){
                    data = {
                        id_prevision : train.id_prevision
                    };
                    Materialize.toast("Le train a bien &eacute;t&eacute; d&eacute;clar&eacute; 	&agrave; l'heure. Vous allez &ecirc;tre redirig&eacute;", 3000)
                    setTimeout(function () {
                        $http.post(URL_ALHEURE, data);
                        window.location.href = URL_MENU;
                    }, 5000);
                }else {
                    Materialize.toast("Vous n'avez pas saisie de train.", 3000);
                }
            }
        }]);

})();