(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.$state = $state;

            $('body').css({ minWidth: "400px" });

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
                        if(data.invalidAttributes){
                            _.each(_.keys(data.invalidAttributes), function(key) {
                                $scope.$parent.errors({
                                    errors: _.map(data.invalidAttributes[key], function(i) {
                                        return i.message;
                                    })
                                });
                            });
                        }
                        if(data.message && !data.invalidAttributes){
                            $scope.$parent.errors({ errors: [data.message] });
                        }
                    })
            };

            $scope.agree = function() {
                if(!$scope.user.agree1 || !$scope.user.agree2) {
                    $scope.$parent.errors({ errors: ["Please Agree"] });
                } else {
                    $scope.next();
                }
            };

            $scope.ethereum = function(){
                if(!$scope.user.ethereumAddress) {
                    $scope.$parent.errors({ errors: ["Ethereum Address must be present!"] });
                    return;
                }
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
                        $state.go('home');
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