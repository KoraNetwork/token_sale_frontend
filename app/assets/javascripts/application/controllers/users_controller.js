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

            $scope.validate = function() {

                var validation = users.validate($scope.user);
                if (validation) {
                    $scope.$parent.errors({ errors: validation.messages });
                    return;
                }
                $scope.processing = true;
                $scope.checkUserInfo(_.pick($scope.user, 'userName', 'email'));
            };

            $scope.checkUserInfo = function (user) {
                users.checkUserInfo(user)
                    .success(function(){
                        $scope.processing = false;
                        $scope.next();
                    })
                    .error(function (data) {
                        $scope.processing = false;
                        if (data.Errors) {
                            $scope.$parent.errors({ errors: users.parseErrors(data.Errors) });
                        }
                    })
            };

            $scope.agree = function() {
                if(!$scope.user.agree1 || !$scope.user.agree2) {
                    $scope.$parent.errors({ errors: ["Please Agree"] });
                    return;
                }
                if (!$scope.user.phone) {
                    $scope.$parent.errors({ errors: ["Please enter Phone Number"] });
                    return;
                }
                $scope.checkUserInfo(_.pick($scope.user, 'phone'))
            };

            $scope.ethereum = function(){
                $scope.processing = true;
                if (!$scope.user.ethereumAddress) {
                    $scope.$parent.errors({ errors: ["Ethereum Address must be present!"] });
                    return;
                }
                $scope.getQR();
                $scope.processing = false;
                $scope.next();
            };

            $scope.getQR = function(){
                users.getQR()
                    .success(function(data){
                        $scope.qr = data;
                    })
                    .error(function(data){

                    })
            };

            $scope.confirm = function(){
                users.confirm($scope.user)
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