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

                $scope.transactions = [];

                $scope.resetTransactionsFilters = function(){
                    $scope.transactions_filters = {
                        limit: 10
                    };
                    $scope.page = 1;
                };

                $scope.resetTransactionsFilters();

                var timer = false;
                $scope.$watch('transactions_filters', function () {
                    if (timer) {
                        $scope.page = 1;
                        $timeout.cancel(timer)
                    }
                    timer = $timeout(function () {
                        $scope.retrieveTransactions();
                    }, 500)
                }, true);

                $scope.retrieveTransactions = function () {
                    transactions.all({page: $scope.page, query: $scope.transactions_filters}).success(function (data) {
                        $scope.transactions = data.data;
                        $scope.count = data.count;
                        var pagination = $('#transactions-pagination');
                        pagination.empty();
                        pagination.removeData('twbs-pagination');
                        pagination.unbind('page');
                        if ($scope.count > 0) {
                            pagination.twbsPagination({
                                totalPages: Math.ceil($scope.count / $scope.transactions_filters.limit),
                                startPage: $scope.page,
                                prev: '<',
                                next: '>',
                                first: false,
                                last: false,
                                visiblePages: 9,
                                onPageClick: function (event, page) {
                                    $scope.page = page;
                                    $scope.retrieveTransactions();
                                }
                            })
                        }
                    }).error(function (data) {
                    });
                };

                $scope.retrieveTransactions();
            }

                $scope.buyWithEth = function () {
                  $scope.ethDialog();
                };

                $scope.buyWithBtc = function () {
                  $scope.btcDialog();
                };

                $scope.refreshValues = function () {
                  $scope.retrieveTransactions();
                  $scope.checkValues();
                  // $state.reload();
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