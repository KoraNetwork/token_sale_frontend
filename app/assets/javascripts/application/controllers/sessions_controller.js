(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('SessionsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'SessionsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, sessions) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $scope.getHtml = function(html){
                    return $sce.trustAsHtml(html);
                };

                $scope.$parent.checkSession();
                if($scope.$parent.user){
                    $state.go('home');
                }

                if($state.current.name == 'login'){

                    $scope.session = {};

                    $scope.submitLoginCredentials = function(){
                        $scope.submitted = true;

                        $scope.processing = true;
                        sessions.login($scope.session)
                            .success(function(){
                                $scope.processing = false;
                                $scope.$parent.checkSession();
                                $state.go('home');
                            })
                            .error(function(data){
                                $scope.validation_errors = data.errors;
                                $scope.processing = false;
                            })
                    };
                }
            }])
}());