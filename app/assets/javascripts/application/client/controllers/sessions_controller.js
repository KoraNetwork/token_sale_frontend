(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('SessionsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'SessionsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, sessions) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $('body').css({ minWidth: "400px" });

                $scope.getHtml = function(html){
                    return $sce.trustAsHtml(html);
                };

                $scope.$parent.checkSession();

                if($scope.$parent.user){
                    $state.go('dashboard');
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

                    $scope.openRegDialog = function () {
                      $scope.regenerateDialog()
                    };

                    $scope.regenerateDialog = function () {
                      ngDialog.open({
                        templateUrl: 'application/client/templates/sessions/regenerate_dialog.html',
                        className: 'ngdialog-theme-default',
                        animation: "slide-from-top",
                        closeOnConfirm: true,
                        scope: $scope,
                        controller: 'SessionsController'
                      });
                    };
                }
            }])
}());