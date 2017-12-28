(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('DashboardController', ['$scope', '$state', 'ngDialog', 'SessionsFactory', '$timeout', 'SweetAlert', 'toaster',
            'TransactionsFactory',
            function ($scope, $state, ngDialog, session, $timeout, SweetAlert, toaster, transactions) {

            $scope.I18n = I18n;
            $scope.$state = $state;
            $scope.moment = moment;

            if ($state.current.name == 'dashboard') {

            }

                $scope.buyWithEth = function () {
                  $scope.ethDialog();
                };

                $scope.buyWithBtc = function () {
                  $scope.btcDialog();
                };

              $scope.ethDialog = function () {
                ngDialog.open({
                  templateUrl: 'application/client/templates/home/eth_dialog.html',
                  className: 'ngdialog-theme-default',
                  scope: $scope,
                  controller: 'DashboardController'
                });
              };

              $scope.btcDialog = function () {
                ngDialog.open({
                  templateUrl: 'application/client/templates/home/btc_dialog.html',
                  className: 'ngdialog-theme-default',
                  scope: $scope,
                  controller: 'DashboardController'
                });
              };
        }])
}());