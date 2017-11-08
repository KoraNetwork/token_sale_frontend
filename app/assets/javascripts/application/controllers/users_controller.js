(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.$state = $state;

            $scope.user = {};
            $scope.slide = 0;

            $scope.register = function(){
                $scope.processing = true;
                users.register($scope.user)
                    .success(function(data){
                        $scope.processing = false;
                        if(!data) {
                            data = { message: 'Ok' }
                        }
                        $scope.$parent.message({ message: data.message });
                        $scope.next();
                    })
                    .error(function(data){
                        $scope.processing = false;
                        $scope.$parent.errors({ errors: [data.message] });
                    })
            };

            $scope.ethereum = function(){
                $scope.processing = true;
                users.ethereum($scope.user.ethereumAddress)
                    .success(function(data){
                        $scope.processing = false;
                        if(!data) {
                            data = { message: 'Ok' }
                        }
                        $scope.$parent.message({ message: data.message });
                        $scope.getQR();
                        $scope.next();
                    })
                    .error(function(data){
                        $scope.processing = false;
                        $scope.$parent.errors({ errors: [data.message] });
                    })
            };

            $scope.getQR = function(){
                users.getQR()
                    .success(function(data){
                        $scope.user.qr = data;
                    })
                    .error(function(data){

                    })
            };

            $scope.confirmQR = function(){
                users.confirmQR($scope.user.token)
                    .success(function(data){
                        $scope.$parent.message({ message: data.message });
                    })
                    .error(function(data){
                        $scope.$parent.errors({ errors: [data.message] });
                    })
            };

            $scope.slideHeight = function(selector) {
                return $(selector).height();
            };

            $scope.next = function() {
                if($scope.slide < 3) $scope.slide += 1;
            };

            $scope.prev = function() {
                if($scope.slide) $scope.slide -= 1;
            }
        }])
}());