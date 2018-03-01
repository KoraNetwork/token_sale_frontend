(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('PasswordsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'PasswordsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, passwords) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $('body').css({ minWidth: "400px" });

                $scope.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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

                    if(!$scope.new_password) {
                        $scope.errors({ errors: ['All field required'] });
                        return
                    }
                    if($scope.new_password === $scope.password_confirmation){
                        $scope.formPending = true;
                        passwords.reset($scope.new_password, $state.params.token)
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

                if ($state.current.name == 'create_password') {

                    $scope.passOptions = {
                        token: $stateParams.token
                    };

                    $scope.createPassword = function () {
                        if ($scope.passOptions.password === $scope.passOptions.passwordConfirmation) {
                            $scope.formPending = true;
                            passwords.create($scope.passOptions)
                                .success(function(data){
                                    $scope.formPending = false;
                                    $scope.message({ message: [data.message] });
                                    $state.go('login');
                                })
                                .error(function(resp){
                                    $scope.formPending = false;
                                    $scope.errors({ errors: [resp.message] })
                                })
                        } else {
                            $scope.errors({ errors: ["Passwords do not match !"] })
                        }
                    };
                }
            }])
}());