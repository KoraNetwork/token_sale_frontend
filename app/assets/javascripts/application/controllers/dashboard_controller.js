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

                $scope.ethDialog = function () {
                  SweetAlert.swal({
                      title: "",
                      text: "Address: " + $scope.balance.ETHWallet.address,
                      imageUrl: $scope.balance.ETHWallet.qrcode,
                      imageSize: "130x130",
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Close",
                      closeOnConfirm: true}
                  );
                };
        }])
}());