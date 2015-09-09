/**
 * Created by Thomas on 24/08/2015.
 */

var zero_seconde = angular.module('zero_seconde', ['xeditable', 'ngRoute', 'ngCookies', 'ngTable']);

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
        .when('/od/statistiques', {
            templateUrl: "/views/OD/stats.html",
            controller: 'ODStatCtrl'
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
        .when('/ace/statistiques', {
            templateUrl: "/views/ACE/statistique.html",
            controller: 'ACEStatCtrl'
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
        const URL_ANNULE = '/od/annule'

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

        $scope.postTrainAnnule = function() {
            if(train != null){
                var data = {
                    id_prevision : train.id_prevision
                };
                $http.post(URL_ANNULE, data)
                    .then(function(){
                        Materialize.toast("Le train a bien &eacute;t&eacute; d&eacute;clar&eacute; annul&eacute;. Vous allez &ecirc;tre redirig&eacute;", 3000);

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
zero_seconde.controller('ODStatCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {
        var url_statODalheure = '/od/statODalheure';
        var url_statODalheureAgent = '/od/statODalheureAgent';
        var url_statODalheureHier = '/od/statODalheureHier';
        var url_statODalheureHierAgent = '/od/statODalheureHierAgent';
        var url_statODalheureSemaine = '/od/statODalheureSemaine';

        var url_statODenRetard = '/od/statODenRetard';
        var url_statODenRetardAgent = '/od/statODenRetardAgent';
        var url_statODenRetardHier = '/od/statODenRetardHier';
        var url_statODenRetardHierAgent = '/od/statODenRetardHierAgent';
        var url_statODenRetardSemaine = '/od/statODenRetardSemaine';

        var url_statODannuleAgent = '/od/statODannuleAgent';

        var url_statODtotalTrain = '/od/statODtotalTrain';
        var url_statODtotalTrainHier = '/od/statODtotalTrainHier';


        $scope.date = new Date();

        $scope.alheure = [];
        $scope.alheureAgent = [];
        $scope.alheureHier = [];
        $scope.alheureHierAgent = [];
        $scope.alheureSemaine = [];

        $scope.enretard = [];
        $scope.enretardAgent = [];
        $scope.enretardHier = [];
        $scope.enretardHierAgent = [];
        $scope.enretardSemaine = [];

        $scope.annuleAgent = [];

        $scope.nbTotalTrain = [];
        $scope.alheureHier = [];
        $scope.nbTotalTrainHier = [];
        $scope.statHier = [];
        $scope.statAjd = [];
        $scope.stat = [];


        $http.get(url_statODalheure)
            .success(function(resultat){
                $scope.alheure = resultat;
            });

        $http.get(url_statODalheureAgent)
            .success(function(resultat){
                $scope.alheureAgent = resultat;
            });

        $http.get(url_statODenRetard)
            .success(function(resultat){
               $scope.enretard = resultat;
            });

        $http.get(url_statODenRetardAgent)
            .success(function(resultat){
                $scope.enretardAgent = resultat;
            });

        $http.get(url_statODtotalTrain)
            .success(function(resultat){
                $scope.nbTotalTrain = resultat;
            });

        $http.get(url_statODalheureSemaine)
            .success(function(resultat){
               $scope.alheureSemaine = resultat;
            });

        $http.get(url_statODenRetardSemaine)
            .success(function(resultat){
               $scope.enretardSemaine = resultat;
            });

        $http.get(url_statODalheureHier)
            .success(function(resultat){
                $scope.alheureHier = resultat;
            });

        $http.get(url_statODalheureHierAgent)
            .success(function(resultat){
                $scope.alheureHierAgent = resultat;
            });

        $http.get(url_statODenRetardHier)
            .success(function(resultat){
                $scope.enretardHier = resultat;
            });

        $http.get(url_statODenRetardHierAgent)
            .success(function(resultat){
                $scope.enretardHierAgent = resultat;
            });

        $http.get(url_statODannuleAgent)
            .success(function(resultat){
                $scope.annuleAgent = resultat;
            });

            $http.get(url_statODtotalTrainHier)
                .success(function(resultat){
                    $scope.nbTotalTrainHier = resultat;
                });

            $timeout(function() {
                if($scope.alheure.length > 0){
                    $scope.statHier = ($scope.alheureHier[0].NbalHeureHier / $scope.nbTotalTrainHier[0].NbTotalTrain);
                    $scope.statAjd = ($scope.alheure[0].NbalHeure / $scope.nbTotalTrain[0].NbTotalTrain);
                    if($scope.statHier > $scope.statAjd){
                        console.log($scope.statHier);
                        console.log($scope.statAjd);
                        $scope.stat = ($scope.statHier - $scope.statAjd);
                        if($scope.stat > 0.09){
                            $scope.stat = $scope.stat*10;
                        }
                        console.log($scope.stat);
                    }else if($scope.statHier == $scope.statAjd){
                        $scope.stat = "idem";
                    }else {
                        $scope.stat = ($scope.statAjd - $scope.statHier);
                        if($scope.stat > 0.09){
                            $scope.stat = $scope.stat*10;
                        }
                        console.log($scope.stat);
                    }
                }else{
                    Materialize.toast("Un problème est survenu lors du chargement des statistiques.", 4000);
                }
            },1000);
    }
]);

zero_seconde.controller('ACEStatCtrl', ['$scope', '$http', '$location', '$timeout',
    function ($scope, $http, $location, $timeout) {
        var url_statODalheure = '/od/statODalheure';
        var url_statODalheureHier = '/od/statODalheureHier';
        var url_statODalheureSemaine = '/od/statODalheureSemaine';

        var url_statODenRetard = '/od/statODenRetard';
        var url_statODenRetardHier = '/od/statODenRetardHier';
        var url_statODenRetardSemaine = '/od/statODenRetardSemaine';

        var url_statODtotalTrain = '/od/statODtotalTrain';
        var url_statODtotalTrainHier = '/od/statODtotalTrainHier';

        var url_statTERBGalheure = '/ace/statTERBGalheure';
        var url_statTERBGretard = '/ace/statTERBGretard';

        var url_statTERFCalheure = '/ace/statTERFcalheure';
        var url_statTERFCretard = '/ace/statTERFCretard';

        var url_statVoyagealheure = '/ace/statVoyagealheure';
        var url_statVoyageretard = '/ace/statVoyageretard';

        $scope.date = new Date();

        $scope.alheure = [];
        $scope.alheureHier = [];
        $scope.alheureSemaine = [];

        $scope.enretard = [];
        $scope.enretardHier = [];
        $scope.enretardSemaine = [];

        $scope.TERBGalheure = [];
        $scope.TERBGretard = [];
        $scope.TERFCalheure = [];
        $scope.TERFCretard = [];
        $scope.VOYAGEalheure = [];
        $scope.VOYAGEretard = [];

        $scope.nbTotalTrain = [];
        $scope.alheureHier = [];
        $scope.nbTotalTrainHier = [];
        $scope.statHier = [];
        $scope.statAjd = [];
        $scope.stat = [];


        $http.get(url_statODalheure)
            .success(function(resultat){
                $scope.alheure = resultat;
            });

        $http.get(url_statTERBGalheure)
            .success(function(resultat){
                $scope.TERBGalheure = resultat;
            });

        $http.get(url_statTERFCalheure)
            .success(function(resultat){
                $scope.TERFCalheure = resultat;
            });

        $http.get(url_statVoyagealheure)
            .success(function(resultat){
                $scope.VOYAGEalheure = resultat;
            });

        $http.get(url_statODenRetard)
            .success(function(resultat){
                $scope.enretard = resultat;
            });

        $http.get(url_statTERBGretard)
            .success(function(resultat){
                $scope.TERBGretard = resultat;
            });

        $http.get(url_statTERFCretard)
            .success(function(resultat){
                $scope.TERFCretard = resultat;
            });

        $http.get(url_statVoyageretard)
            .success(function(resultat){
                $scope.VOYAGEretard = resultat;
            });

        $http.get(url_statODtotalTrain)
            .success(function(resultat){
                $scope.nbTotalTrain = resultat;
            });

        $http.get(url_statODalheureSemaine)
            .success(function(resultat){
                $scope.alheureSemaine = resultat;
            });

        $http.get(url_statODenRetardSemaine)
            .success(function(resultat){
                $scope.enretardSemaine = resultat;
            });

        $http.get(url_statODalheureHier)
            .success(function(resultat){
                $scope.alheureHier = resultat;
            });


        $http.get(url_statODenRetardHier)
            .success(function(resultat){
                $scope.enretardHier = resultat;
            });


        $http.get(url_statODtotalTrainHier)
            .success(function(resultat){
                $scope.nbTotalTrainHier = resultat;
            });

        $timeout(function() {
            if($scope.alheure.length > 0){
                $scope.ponctuDV = (($scope.alheure[0].NbalHeure / $scope.nbTotalTrain[0].NbTotalTrain)*100);
            }else{
                Materialize.toast("Un problème est survenu lors du chargement des statistiques.", 4000);
            }
        },1000);

    }
]);

zero_seconde.controller('historiqueCtrl', ['$scope', '$http', '$location', '$timeout', '$filter', 'ngTableParams',
    function ($scope, $http, $location, $timeout, $filter, ngTableParams) {
        var url_histo = "/ace/histo";
        var url_unite = "/ace/histo/unite";
        var url_cause_retard = "/ace/histo/cause_retard";
        var url_put = "/ace/histo/send";
        var url_del = "/ace/histo/delete";


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
        }];

        $http.get(url_histo)
            .success(function (resultat) {
                $scope.retards = resultat;
                $timeout(function(){
                    $scope.tableParams = new ngTableParams({
                        page: 1,
                        count: 5
                    }, {
                        total: resultat.length,
                        counts: [],
                        getData: function ($defer, params) {
                            $scope.retards = resultat.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.retards);
                        }
                    });
                }, 1000);
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

            return (selected.length) ? selected[0].text : 'Non';

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

                $http.put(url_put, result)
                    .then(function(response){
                        Materialize.toast("Modification effectuée", 2000);
                    }, function(response){
                        Materialize.toast("Erreur lors de la modification", 2000);
                    });
            },2000);
        };

        $scope.removeHisto = function(id_historique, index, ret) {
            if (window.confirm("Êtes vous sur de vouloir supprimer le retard ?")){
                $scope.retards.splice(index, 1);

                $http.delete(url_del + '/' + ret.id_historique);
            }
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

        $scope.consultStat = function() {
            $timeout(function() {
               $location.path('/od/statistiques').replace();
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

        $scope.consultStat = function() {
            $timeout(function () {
                $location.path('/ace/statistiques').replace();
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
