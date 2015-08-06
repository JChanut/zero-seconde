(function () {
var ZSauthApp = angular.module('authApp', []);

    ZSauthApp.controller('authCtrl', ['$scope', '$http',
        function($scope, $http) {

        $scope.authPostForm = function() {

            var encodedJson = {
                username : encodeURIComponent($scope.authCtrl.inputData.username),
                password : encodeURIComponent($scope.authCtrl.inputData.password)
            };
            $http({
                method: 'POST',
                url: '/authentification',
                data: encodedJson
            })
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if (data.connexion) {
                        if (data.fonction === "OD") {
                            Materialize.toast('V&eacute;rification des infos...', 3000);
                            setTimeout(function () {
                                window.location.href = '/retard'
                            }, 4000);
                        } else if (data.fonction === "ACE") {
                            Materialize.toast('V&eacute;rification des infos...', 3000);
                            setTimeout(function () {
                                window.location.href = '/ace/historique'
                            }, 4000);
                        } else {
                            Materialize.toast('Votre compte n\'est pas habilité.', 3000);
                        }
                    }
                    else {
                        $scope.authCtrl.inputData.username = [];
                        $scope.authCtrl.inputData.password = [];
                        Materialize.toast('CP ou mot de passe incorrect !', 5000);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    console.log("error");
                    Materialize.toast('Connexion momentan&eacute;ment indisponible...', 6000);
                })
        }
    }]);

    var ZSregisterApp = angular.module('registerApp', []);

    ZSregisterApp.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.registerPostForm = function() {

            var encodedString = 'cp=' + encodeURIComponent($scope.formData.cp) + '&email=' + encodeURIComponent($scope.formData.email) + '&password=' + encodeURIComponent($scope.formData.password) + '&password_again=' + encodeURIComponent($scope.formData.password_again);

            if ($scope.formData.password == $scope.formData.password_again){
            $http({
                method: 'POST',
                url: 'back/inscription.php',
                data: encodedString,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function(data, status, headers, config) {
                    if (data.resultat === true) {
                        $scope.formData.cp = [];
                        $scope.formData.email = [];
                        $scope.formData.password = [];
                        $scope.formData.password_again = [];
                        Materialize.toast('Inscription terminée. Vous allez être redirigé dans quelques secondes.', 3000);
                        setTimeout(function(){window.location.href = 'index.html'}, 4000);
                    }else if(data.resultat === false){
                        $scope.formData.cp = [];
                        $scope.formData.email = [];
                        $scope.formData.password = [];
                        $scope.formData.password_again = [];
                        Materialize.toast('L\'identifiant ou l\'adresse mail existe déjà.', 3000);
                    }else {
                        Materialize.toast('Problème lors de l\'enregistrement.', 3000);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log("error");
                    Materialize.toast('Connexion momentanément indisponible...', 6000);
                })
            }else {
                $scope.formData.password = [];
                $scope.formData.password_again = [];
                Materialize.toast('Vous n\'avez pas saisie le même mot de passe!', 5000);
            }
        }
    }]);

    })();
