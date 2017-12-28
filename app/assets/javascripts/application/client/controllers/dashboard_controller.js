(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('DashboardController', ['$scope', '$state', 'ngDialog', 'SessionsFactory', '$timeout', 'SweetAlert', 'toaster',
            'TransactionsFactory',
            function ($scope, $state, ngDialog, session, $timeout, SweetAlert, toaster, transactions) {

            $scope.I18n = I18n;
            $scope.$state = $state;
            $scope.moment = moment;

            var timer = false;

              $scope.$watch('transactions_filters', function () {
                if (timer) {
                  $scope.page = 1;
                  $timeout.cancel(timer)
                }
                timer = $timeout(function () {
                  $scope.$parent.retrieveTransactions();
                }, 500)
              }, true);


              $scope.$parent.retrieveTransactions();

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