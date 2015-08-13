/**
 * Created by Alan on 06/08/2015.
 */
(function () {
    var ZSretardData = angular.module('retardDataApp', []);

    ZSretardData.controller('retardDataCtrl', ['$scope', '$http',
        function($scope, $http) {
            var unite = null;
            var motif = null;
            var commentaire = null;

            var url_get = '/unites';
            var url_post = '/post_retard';

            $scope.selected = {};

            //Méthode GET -> Récupérer et afficher les données
            $http.get(url_get).
                then(function(response) {
                    $scope.data = response.data;
                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

            $scope.update_unite = function () {
                unite = $scope.selected.unite;
                motif = null;
            };

            $scope.update_motif = function () {
                motif = $scope.selected.motif;
            };

            $scope.update_commentaire = function () {
                commentaire = $scope.selected.commentaire;
                if(commentaire.length == 0)
                    commentaire = null;
            };

            $scope.validation = function() {
                var valide = false;
                if(unite != null) {
                    if((unite.motif.length > 0 && motif != null) || (unite.motif.length == 0 && motif == null))
                        valide = true;
                }

                if(valide) {
                    data = {
                        id_unite : unite.id_unite,
                        id_motif : motif.id_retard,
                        commentaire : commentaire
                    };
                    $http.post(url_post, data);
                    Materialize.toast('Le retard a bien &eacute;t&eacute; enregistr&eacute;. Vous allez &ecirc;tre redirig&eacute;.', 3000);
                    setTimeout(function () {
                        window.location.href = '/'
                    }, 4000);
                }else {
                    Materialize.toast('Probl&egrave;me lors de l\'enregistrement...', 3000);
                }
            }
        }]);

})();
