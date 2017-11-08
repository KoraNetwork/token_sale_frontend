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

                    $scope.login = function(){
                        $scope.submitted = true;

                        $scope.processing = true;
                        sessions.login($scope.session)
                            .success(function(data){
                                $scope.processing = false;
                                $scope.$parent.checkSession();
                                $scope.$parent.message({ message: data.message });
                            })
                            .error(function(data, status){
                                $scope.processing = false;
                                $scope.$parent.errors({ errors: [data.message] });
                            })
                    };
                }
            }])
}());