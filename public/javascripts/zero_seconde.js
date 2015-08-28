/**
 * Created by Thomas on 24/08/2015.
 */

var zero_seconde = angular.module('zero_seconde', ['xeditable', 'ngRoute', 'ngCookies']);

zero_seconde.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '/views/connexion.html',
            controller  : 'authCtrl'
        })
        .when('/od', {
            templateUrl: "/views/OD/menu.html",
            controller :"menu_odCtrl"
        })
        .when('/od/retard', {
            templateUrl: "/views/OD/retard.html",
            controller: 'trainDataCtrl'
        })
        .when('/od/infos_retard', {
            templateUrl: "/views/OD/infos_retard.html",
            controller: 'retardDataCtrl'
        })
        .when('/ace', {
            templateUrl: "views/ACE/menu.html",
            controller : "menu_aceCtrl"
        })
        .when('/ace/historique', {
            templateUrl: "/views/ACE/ace_historique.html",
            controller: 'historiqueCtrl'
        })
        .when('/ace/ajoutHoraires', {
             templateUrl: "/views/ACE/ajoutHoraires.html",
            controller: 'ajoutHoraireCtrl'
        })
        .when('/ace/stat', {
            templateUrl: "/views/ACE/statistique.html",
            controller: 'statistiqueCtrl'
        });
    $locationProvider.html5Mode(true);
});

zero_seconde.value('infoUser',{fonction:'guest'});

zero_seconde.factory('serviceRetard',function($http){

});

zero_seconde.controller('authCtrl', ['$scope', '$http', '$location', '$timeout', 'infoUser',
function($scope, $http, $location, $timeout, infoUser) {
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
                .success(function(data) {
                    if (data.connexion) {
                        infoUser.fonction = data.fonction;
                        if (data.fonction === "OD") {
                            Materialize.toast('Connexion effectu&eacute;e', 3000);
                            $timeout(function () {
                                $location.path('/od');
                            });
                        } else if (data.fonction === "ACE") {
                            Materialize.toast('Connexion effectu&eacute;e', 3000);
                            $timeout(function () {
                                $location.path('/ace').replace();
                            });
                        } else {
                            Materialize.toast('Votre compte n\'est pas habilit&eacute;.', 3000);
                        }
                    }
                    else {
                        $scope.authCtrl.inputData.username = [];
                        $scope.authCtrl.inputData.password = [];
                        Materialize.toast('CP ou mot de passe incorrect !', 5000);
                    }
                })
                .error(function(data) {
                    console.log(data);
                    console.log("error");
                    Materialize.toast('Connexion momentan&eacute;ment indisponible...', 6000);
                })
        }
    }
]);

zero_seconde.controller('retardDataCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {
        var unite = null;
        var motif = null;
        var commentaire = null;

        const URL_MENU = '/od';
        const URL_GET = '/od/unites';
        const URL_POST = '/od/post_retard';

        $scope.selected = {};

        //Méthode GET -> Récupérer et afficher les données
        $http.get(URL_GET).
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
                var data = {
                    id_unite : unite.id_unite,
                    id_motif : motif.id_retard,
                    commentaire : commentaire
                };
                $http.post(URL_POST, data);
                Materialize.toast('Le retard a bien &eacute;t&eacute; enregistr&eacute;. Vous allez &ecirc;tre redirig&eacute;.', 3000);

                $timeout(function () {
                    $location.path(URL_MENU).replace();
                });
            }else {
                Materialize.toast('Probl&egrave;me lors de l\'enregistrement...', 3000);
            }
        }
    }
]);

zero_seconde.controller('trainDataCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {

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
        };

        $scope.postTrain = function() {
            if(train != null){
                var data = {
                    id_prevision : train.id_prevision
                };
                $http.post(URL_RETARD, data).
                    then(function() {
                        $timeout(function () {
                            $location.path(URL_RETARD).replace();
                        });
                    }, function(response) {
                        console.log(response);
                    });
            }else {
                Materialize.toast("Vous n'avez pas saisie de train.", 3000);
            }

        };

        $scope.postTrainAlheure = function() {
            if(train != null){
                var data = {
                    id_prevision : train.id_prevision
                };
                $http.post(URL_ALHEURE, data)
                    .then(function(){
                        Materialize.toast("Le train a bien &eacute;t&eacute; d&eacute;clar&eacute; 	&agrave; l'heure. Vous allez &ecirc;tre redirig&eacute;", 3000);

                        $timeout(function () {
                            $location.path(URL_MENU).replace();
                        });
                    });

            }else {
                Materialize.toast("Vous n'avez pas saisie de train.", 3000);
            }
        }
    }
]);

zero_seconde.controller('ajoutHoraireCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {

        $scope.fileNameChanged = function (ele) {
            $scope.$apply(function() {
                $scope.nom_fichier = ele.files[0].name;
                if($scope.nom_fichier.length>20)
                    $scope.nom_fichier=$scope.nom_fichier.slice(0,20)+"...";
            });
        };

        $scope.sendFile = function(){
            var fd = new FormData();
            fd.append('file', $scope.file);
            $http.post("/ace/ajoutHoraires/send", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(){
                    Materialize.toast("L'envoie a &eacute;t&eacute; effectu&eacute; !", 3000);
                    $timeout(function() {
                        $location.path('/ace').replace();
                    });
                })
                .error(function(){
                    Materialize.toast("L'envoie a &eacute;chou&eacute; !", 3000);
                });
        }
    }
]);

zero_seconde.controller('statistiqueCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {

        $scope.sendFile = function(){
            var fd = new FormData();
            fd.append('file', $scope.file);
            $http.post("/ace/ajoutHoraires/send", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(){
                    $timeout(function() {
                        $location.path('/ace').replace();
                    });
                })
                .error(function(){
                });
        }
    }
]);

zero_seconde.controller('historiqueCtrl', ['$scope', '$http', '$location', '$timeout', '$filter',
    function ($scope, $http, $location, $timeout, $filter) {
        var url_histo = "/ace/histo";
        var url_unite = "/ace/histo/unite";
        var url_cause_retard = "/ace/histo/cause_retard";
        var url_put = "/ace/histo/send";


        $scope.unites = [];
        $scope.retards = [];
        $scope.cretards = [];

        $scope.etats = [{
            valeur:"ok",
            text:"parti"
        },{
            valeur:"ko",
            text:"annulé"
        },{
            valeur:"inattendu",
            text:"déprogrammé"
        }];

        $scope.etat_retard = [{
            valeur:0,
            text:'oui'
        },{
            valeur:1,
            text:'non'
        }]

        $http.get(url_histo)
            .success(function (resultat) {
                $scope.retards = resultat;
                $scope.loadUnites();
                console.log($scope.retards[0]);
            });


        $scope.loadUnites = function () {
            $http.get(url_unite)
                .success(function (data) {
                    $scope.unites = data;
                    $scope.loadCauseRetard();
                });
        };


        $scope.loadCauseRetard = function () {
            $http.get(url_cause_retard)
                .success(function (data) {
                    $scope.cretards = data;
                });
        };


        $scope.showUnites = function (libelle) {
            var selected = $filter('filter')($scope.unites, {id_unite: libelle});

            return (selected.length) ? selected[0].libelle : 'Non renseigné';

        };

        $scope.showEtat = function (libelle) {

            var selected = $filter('filter')($scope.etats, {valeur: libelle});

            return (selected.length) ? selected[0].text : 'Parti';

        };

        $scope.showEtat_retard = function (libelle) {

            var selected = $filter('filter')($scope.etat_retard, {valeur: libelle});

            return (selected.length) ? selected[0].text : 'non';

        };

        $scope.changeUnite = function(data, line){
            console.log(line);
            line.id_unite = data;
            console.log(line);
            console.log("data");
            console.log(data);
            var editables = this.$form.$editables;
            for(var i=0; i<=editables.length-1; i++){
                if(editables[i].name == 'id_retard'){
                    editables[i].scope.$data = "";
                }
            }

        };

        $scope.showMotifs = function (libelle) {
            var selected = $filter('filter')($scope.cretards, {id_retard: libelle});

            return (selected.length) ? selected[0].libelle : 'Non renseigné';

        };

        $scope.updateUnite = function (data, ret, index) {
            ret.id_unite = data;
            $scope.retards[index].id_retard = null;
            console.log("info2");


        };

        $scope.updateRetard = function (data, ret) {
            ret.id_retard = data;
        };

        $scope.updateHisto = function (index) {

            setTimeout(function(){
                var infos = $scope.retards[index];
                var result =  {
                    id_historique: infos.id_historique,
                    id_prevision: infos.id_prevision,
                    retard: infos.retard,
                    id_unite: infos.id_unite,
                    id_retard: infos.id_retard,
                    commentaire: infos.commentaire,
                    duree_retard: infos.duree_retard
                };
                console.log("INFOS");
                console.log(infos);
                console.log(result);
                $http.put(url_put, result);
            },2000);
        };

    }]);

zero_seconde.controller('menu_odCtrl', ['$scope', '$http', '$location', '$timeout', 'infoUser',
    function ($scope, $http, $location, $timeout,infoUser) {
        $scope.userFonction = infoUser.fonction;
        $scope.newDep = function() {
            $timeout(function () {
                $location.path('/od/retard').replace();
            });
        };

        $scope.go_ace = function() {
            $timeout(function () {
                $location.path('/ace').replace();
            });
        }
    }
]);

zero_seconde.controller('menu_aceCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {
        $scope.ajout_horaire = function() {
            $timeout(function () {
                $location.path('/ace/ajoutHoraires').replace();
            });
        };

        $scope.affiche_historique = function() {
            $timeout(function () {
                $location.path('/ace/historique').replace();
            });
        };

        $scope.go_od = function() {
            $timeout(function () {
                $location.path('/od').replace();
            });
        }
    }
]);

zero_seconde.controller('menu_bottomCtrl', ['$scope', '$rootScope', '$http', '$location', '$timeout', 'infoUser',
    function ($scope, $rootScope, $http, $location, $timeout, infoUser) {
        $scope.affichage = {
            menu : false,
            boutton_menu : false
        };

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $timeout(function(){
                if($location.path() == "/") {
                    $scope.affichage.menu = false;
                } else {
                    $scope.affichage.menu = true;
                    if(($location.path() == "/od")||($location.path() == "/ace")){
                        $scope.affichage.boutton_menu = false;
                    }
                    else {
                        $scope.affichage.boutton_menu = true;
                    }
                }
            });
        });

        $scope.menu = function() {
            var path = (infoUser.fonction == "OD")?'/od':'/ace';
            $timeout(function () {
                $location.path(path).replace();
            });
        };

        $scope.deconnexion = function() {
            $http.post('/deconnexion')
                .then(function () {
                    $timeout(function() {
                        $location.path('/');
                    });
                });
        };
    }
]);

zero_seconde.directive("fileread", [function () {
    return {
        $scope: {
            fileread: "="
        },
        link: function ($scope, element) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    $scope.$apply(function () {
                        $scope.fileread = loadEvent.target.result;
                    });
                };
                $scope.file = changeEvent.target.files[0];
            });
        }
    }
}]);
