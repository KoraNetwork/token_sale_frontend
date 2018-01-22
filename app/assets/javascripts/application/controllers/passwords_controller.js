(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('PasswordsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'PasswordsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, passwords) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $('body').css({ minWidth: "400px" });

                $scope.submitForgotPassword = function(){
                    $scope.submitted = true;
                    $scope.formPending = true;
                    passwords.forgot($scope.email)
                        .success(function(response){
                                $scope.formPending = false;
                                $scope.message({ message: [response.message] });
                                $state.go('login');
                            })
                        .error(function(resp) {
                            $scope.formPending = false;
                            $scope.errors({ errors: [resp.message] })
                        })
                };

                $scope.submitResetPassword = function(){
                    $scope.submitted = true;

                    $scope.formPending = true;
                    if($scope.password === $scope.password_confirmation){
                        passwords.reset($scope.password, $state.params.token)
                            .success(function(data){
                                $scope.formPending = false;
                                $scope.message({ message: [data.message] });
                                $state.go('login');
                            })
                            .error(function(resp){
                                $scope.formPending = false;
                                $scope.errors({ errors: [resp.message] })
                            })
                    }else{
                        $scope.errors({ errors: ["Passwords does not match!"] });
                    }

                };

            }])
}());