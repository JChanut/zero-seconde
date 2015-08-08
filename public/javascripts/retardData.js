/**
 * Created by Alan on 06/08/2015.
 */
(function () {
    var ZSretardData = angular.module('retardDataApp', []);

    ZSretardData.controller('retardDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            var url = 'http://localhost:3000/unites';
            $scope.unites = [];
            console.log($scope.unites);

            //Méthode GET -> Récupérer et afficher les données
                $http.get(url).
                    then(function(response) {
                        $scope.unites = response;
                    }, function(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
        }]);

})();
