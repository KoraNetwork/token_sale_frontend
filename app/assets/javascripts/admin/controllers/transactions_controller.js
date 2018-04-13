(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('TransactionsController', ['$scope', '$state', 'ngDialog', '$timeout', 'toaster', 'TransactionsFactory',
            function ($scope, $state, ngDialog, $timeout, toaster, transactions) {

                $scope.I18n = I18n;
                $scope.$state = $state;
                $scope.moment = moment;

                if ($state.current.name == 'transactions') {

                    var timer = false;

                    $scope.$watch('transactions_filters', function () {
                        if (timer) {
                            $scope.page = 1;
                            $timeout.cancel(timer)
                        }
                        timer = $timeout(function () {
                            $scope.retriveTransactions();
                        }, 500)
                    }, true);

                    transactions.filters()
                        .success(function(data){
                            $scope.filters = data;
                        })
                        .error(function(data){

                        });

                    $scope.retriveTransactions = function () {
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
                                        $scope.retriveTransactions();
                                    }
                                })
                            }
                        }).error(function (data) {
                            $scope.errors({ errors: [data.message] })
                        });
                    };

                    $scope.resetFilters = function(){
                        $scope.transactions_filters = {
                            limit: 10
                        };
                        $scope.page = 1;
                    };

                    $scope.resetFilters();
                }

                $scope.getWallets = function () {
                  transactions.getWallets()
                    .success(function(resp) {
                      $scope.wallet = resp;
                    })
                };

                $scope.getWallets();

                $scope.updateWallets = function () {
                  transactions.updateWallets($scope.wallet)
                    .success(function(resp) {
                      $scope.message({ message: ["Successfully updated"] })
                    })
                    .error(function(err) {
                      $scope.errors({ errors: [err.message] })
                    })
                }

            }])
}());