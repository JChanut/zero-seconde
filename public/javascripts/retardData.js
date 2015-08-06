/**
 * Created by Alan on 06/08/2015.
 */
(function () {
    var ZSretardData = angular.module('retardDataApp', []);

    ZSretardData.controller('retardDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            var url = 'http://localhost:3000/infos_retard';
            $scope.unites=[];

            //M�thode GET -> R�cup�rer et afficher les donn�es
            $scope.init=function(){
                $http.get(url)
                    .success(function(resultat) {
                        $scope.unites = resultat;
                        setTimeout($scope.initCheck,1000);
                    });
            };
            $scope.init();

        }]);

})();
