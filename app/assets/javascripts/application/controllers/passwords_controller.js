(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('PasswordsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', '$sce',
            function ($scope, $state, ngDialog, $stateParams, $timeout) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;

                $('body').css({ minWidth: "400px" });

            }])
}());