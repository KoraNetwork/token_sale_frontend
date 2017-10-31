(function () {

    "use strict";

    angular.module('KoraICOFrontendLandingApp')
        .controller('PasswordsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce', 'SessionsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, $sce, sessions) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;
            }])
}());