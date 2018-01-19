(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('PasswordsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'PasswordsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, passwords) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $('body').css({ minWidth: "400px" });

                var message = function(data) {
                    if(data.message){
                        toaster.pop('success', "", data.message);
                    }
                };

                $scope.submitForgotPassword = function(){
                    $scope.submitted = true;
                    $scope.formPending = true;
                    passwords.forgot($scope.email)
                        .then(function(response){
                                $scope.formPending = false;
                                message(response.data.message);
                                $state.go('login');
                            },
                            function(response){
                                $scope.formPending = false;
                                errors(response.data);
                            })
                };

                $scope.submitResetPassword = function(){
                    $scope.submitted = true;

                    $scope.formPending = true;
                    if($scope.password == $scope.password_confirmation){
                        passwords.reset($scope.password, $state)
                            .success(function(data){
                                $scope.formPending = false;
                                message(data.message);
                                $state.go('login');
                            })
                            .error(function(data){
                                $scope.formPending = false;
                            })
                    }else{
                        message('');
                    }

                };

            }])
}());