(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('HomeController', ['$scope', '$state', 'ngDialog', 'SessionsFactory', '$timeout', 'toaster',
            function ($scope, $state, ngDialog, session, $timeout, toaster) {

            $scope.I18n = I18n;
            $scope.$state = $state;

            $('body').css({ minWidth: "1300px" });

            $timeout(function(){
                if($scope.flash.error.length > 0){
                    toaster.pop('error', "", $scope.flash.error);
                }
                if($scope.flash.message.length > 0){
                    toaster.pop('success', "", $scope.flash.message);
                }
            }, 1000);

            $scope.errors = function(data) {
                if(data.errors){
                    for(var i = 0; i < data.errors.length; ++i) {
                        toaster.pop('error', "", data.errors[i]);
                    }
                }
            };

            $scope.message = function(data) {
                if(data.message){
                    for(var i = 0; i < data.message.length; ++i) {
                        toaster.pop('success', "", data.message[i]);
                    }
                }
            };

            $scope.parseErrors = function (resp) {
                $scope.errors({errors: _.flatten(
                    _.map(resp.Errors, function (errs) {
                        return _.map(errs, function(err) {
                            return err.message
                        })
                    })
                )})
            };

            $scope.checkSession = function(){
                session.profile()
                  .success(function(data, status){
                      if (data.role != 'admin') {
                          $scope.errors({ errors: ["You are not admin!"] });
                          $scope.logout();
                      }
                      else {
                          $scope.current_user = data;
                          if(['forgot_password', 'admins_password'].indexOf($state.current.name) < 0){
                              $state.go('users');
                          } else {
                              session.logout().success(function(){
                                  window.location.reload();
                              })
                          }
                      }
                  })
                  .error(function(data){
                      $scope.current_user = false;
                      if([
                              'login',
                              'forgot_password',
                              'admins_password'].indexOf($state.current.name) < 0){
                          $state.go('login');
                      }
                  });
            };

            if($state.current.name != 'login' && 'admins_password'){
                $scope.checkSession();
            }

            $scope.$state = $state;

            $scope.deleteAllCookies = function () {
                document.cookie.split(';').forEach(function(c) {
                    document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                });
            };

            $scope.$watch('$state.current.name', function (state) {
                if (!state.includes('login') && !$scope.current_user) {
                    $state.go('login');
                }
            });

            $scope.logout = function(){
                session.logout()
                    .success(function(){
                        $scope.deleteAllCookies();
                        $scope.current_user = null;
                        $state.go('login')
                    })
            };

            $scope.changeLanguage = function(locale){
                I18n.locale = locale;
            };

            $scope.openChangePasswordDialog = function () {
                ngDialog.closeAll();
                $scope.passwordOptions = {};
                ngDialog.open({
                    templateUrl: 'admin/templates/users/change_password.html',
                    scope: $scope,
                    className: 'ngdialog-theme-default ng-dialog-medium'
                });
            };

            $scope.changePassword = function () {

                var allFields = true;
                var keys = [
                    'oldPassword',
                    'newPassword',
                    'newPasswordConfirm',
                    'token'
                ];

                for(var i = 0; i < keys.length; i++) {
                    if(!$scope.passwordOptions[keys[i]]) allFields = false;
                }

                if(allFields) {
                    session.changePassword($scope.passwordOptions)
                        .success(function(data){
                            $scope.passwordOptions = {};
                            $scope.message({ message: [data.message] });
                        })
                        .error(function(data){
                            $scope.errors({ errors: [data.message] })
                        });
                } else {
                    $scope.errors({ errors: ['All fields are required.'] })
                }
            }
        }])
}());