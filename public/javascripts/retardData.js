/**
 * Created by Alan on 06/08/2015.
 */
(function () {
    var ZSretardData = angular.module('retardDataApp', []);

    ZSretardData.controller('retardDataCtrl', ['$scope', '$http',
        function($scope, $http) {

            var url = 'http://localhost:3000/unites';


            $scope.selected = {};

            //M�thode GET -> R�cup�rer et afficher les donn�es
                $http.get(url).
                    then(function(response) {
                        $scope.data = response.data;
                    }, function(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


        }]);

})();
