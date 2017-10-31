(function () {

    "use strict";

    angular.module('KoraICOFrontendLandingApp')
        .controller('SessionsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'SessionsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, sessions) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $scope.session = {};

                $scope.submitLoginCredentials = function(){
                    $scope.submitted = true;

                    $scope.processing = true;
                    sessions.login($scope.session)
                        .success(function(){
                            $scope.processing = false;
                            window.location = '/app'
                        })
                        .error(function(data){
                            $scope.processing = false;
                        })
                };
            }])
}());