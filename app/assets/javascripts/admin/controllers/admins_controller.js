(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('AdminsController', ['$scope', '$state', 'ngDialog', 'UsersFactory', '$timeout', 'toaster',
            function ($scope, $state, ngDialog, admins, $timeout, toaster) {

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
                    admins.getUsers({page: $scope.page, query: $scope.filters}).success(function (data) {
                        $scope.admins = data.data;
                        $scope.count = data.count;
                    }).error(function (data) {
                    });
                };

            }])
}());