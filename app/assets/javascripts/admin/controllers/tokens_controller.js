(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('TokensController', ['$scope', '$state', 'ngDialog', 'toaster', '$stateParams', '$timeout', 'SweetAlert',
            '$sce', 'TokensFactory',
            function ($scope, $state, ngDialog, toaster, $stateParams, $timeout, SweetAlert, $sce, tokens) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;
                $scope.tokens = [];


                var timer = false;

                $scope.$watch('tokens_filters', function () {
                    if (timer) {
                        $scope.page = 1;
                        $timeout.cancel(timer)
                    }
                    timer = $timeout(function () {
                        $scope.retrieveTokens();
                    }, 500)
                }, true);

                $scope.retrieveTokens = function () {
                    tokens.getTokens({page: $scope.page, query: $scope.tokens_filters}).success(function (data) {
                        $scope.preSales = data.sale.preSale;
                        $scope.publicSales = data.sale.publicSale;
                        $scope.sumTokens = data.sale;
                        $scope.total = data.total;
                        console.log();
                        $scope.count = data.count;
                        var pagination = $('#tokens-pagination');
                        pagination.empty();
                        pagination.removeData('twbs-pagination');
                        pagination.unbind('page');
                        if ($scope.count > 0) {
                            pagination.twbsPagination({
                                totalPages: Math.ceil($scope.count / $scope.tokens_filters.limit),
                                startPage: $scope.page,
                                prev: '<',
                                next: '>',
                                first: false,
                                last: false,
                                visiblePages: 9,
                                onPageClick: function (event, page) {
                                    $scope.page = page;
                                    $scope.retrieveTokens();
                                }
                            })
                        }
                    }).error(function (data) {
                    });
                };

                $scope.resetTokensFilters = function(){
                    $scope.tokens_filters = {
                        limit: 10
                    };
                    $scope.page = 1;
                };

                $scope.resetTokensFilters();
                $scope.retrieveTokens();


            }])
}());