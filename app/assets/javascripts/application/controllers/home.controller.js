(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('HomeController', ['$scope', '$state', 'ngDialog', 'SessionsFactory', '$timeout', 'toaster',
            function ($scope, $state, ngDialog, session, $timeout, toaster) {

            $scope.I18n = I18n;
            $scope.$state = $state;

            $scope.checkSession = function(){
                session.check()
                        .success(function(data){
                            $scope.current_user = data.current_user;
                        })
                        .error(function(){
                            $scope.current_user = false;
                        });
            };
            if($state.current.name != 'login'){
                $scope.checkSession();
            }

            $scope.$state = $state;

            $scope.logout = function(){
                session.logout().success(function(){
                    window.location = '/'
                })
            };

            $timeout(function(){
                if($scope.flash.error.length > 0){
                    toaster.pop('error', "", $scope.flash.error);
                }
                if($scope.flash.message.length > 0){
                    toaster.pop('success', "", $scope.flash.message);
                }
            }, 1000);

            $scope.changeLanguage = function(locale){
                I18n.locale = locale;
            }
        }])
}());