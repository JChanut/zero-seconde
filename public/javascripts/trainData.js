/**
 * Created by Alan on 11/08/2015.
 */
(function () {
    var ZStrainData = angular.module('trainDataApp', []);

    ZStrainData.controller('trainDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            var url = 'http://localhost:3000/trains';

            $scope.trains = [];

            //M�thode GET -> R�cup�rer et afficher les donn�es
            $http.get(url).
                then(function(response) {
                    $scope.trains = response.data;
                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });


        }]);

})();