(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('AdminsController', ['$scope', '$state', 'ngDialog', 'UsersFactory', 'AdminsFactory', '$timeout', 'toaster',
            function ($scope, $state, ngDialog, users, admins, $timeout, toaster) {

                $scope.I18n = I18n;
                $scope.$state = $state;
                $scope.filters = {role: "admin"};

                var timer = false;

                $scope.$watch('admins_filters', function () {
                    if (timer) {
                        $scope.page = 1;
                        $timeout.cancel(timer)
                    }
                    timer = $timeout(function () {
                        $scope.retrieveAdmins();
                    }, 500)
                }, true);

                $scope.retrieveAdmins = function () {
                    users.getUsers({page: $scope.page, query: $scope.filters}).success(function (data) {
                        $scope.admins = data.data;
                        $scope.count = data.count;
                    }).error(function (data) {
                    });
                };

                $scope.createAdmin = function(){
                    $scope.submitted = true;
                    $scope.formPending = true;
                    admins.postEmail($scope.email)
                        .success(function(response){
                            $scope.formPending = false;
                            $scope.message({ message: [response.message] });
                        })
                        .error(function(resp) {
                            $scope.formPending = false;
                            $scope.errors({ errors: [resp.message] })
                        })
                };

                $scope.createPassword = function(){
                    $scope.submitted = true;
                    $scope.formPending = true;
                    if($scope.password === $scope.password_confirmation){
                        admins.createPassword($scope.password, $state.params.token, $scope.code)
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

                $scope.createAdminDialog = function () {
                    ngDialog.closeAll();
                    ngDialog.open({
                        templateUrl: 'admin/templates/admins/create_admin_dialog.html',
                        className: 'ngdialog-theme-default regenerate-width',
                        scope: $scope,
                        controller: 'AdminsController'
                    });
                };

            }])
}());