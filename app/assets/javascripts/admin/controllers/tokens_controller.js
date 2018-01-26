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
                $scope.selected = null;
                $scope.isPublicSale = false;
                $scope.checkSale = false;

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
                        $scope.sale = data.sale;
                        $scope.checkSale = data.sale.isPublicSale;
                        $scope.total = data.total;
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
                        $scope.errors({ errors: [data.message] })
                    });
                };

                $scope.resetTokensFilters = function(){
                    $scope.tokens_filters = {
                        limit: 10
                    };
                    $scope.page = 1;
                };

                $scope.resetTokensFilters();

                $scope.sendTokens = function () {
                  tokens.sendTokens($scope.sale)
                      .success(function() {
                          $scope.message({ message: ["Succesfully updated"] });
                          $scope.selected = null;
                      })
                      .error(function(resp) {
                          $scope.errors({ errors: [resp.message] })
                      })
                };

                $scope.newSale = function () {
                    $scope.selected = $scope.preSales.length;
                    $scope.preSales.push({})
                };

                $scope.newPublic = function () {
                    $scope.selected = $scope.publicSales.length;
                    $scope.publicSales.push({})
                };

                $scope.cancelNewSale = function () {
                  $scope.newSaleRow = false;
                  $scope.retrieveTokens();
                };

                $scope.selectSale = function (index, actions) {
                    $scope.selected = index;
                    $scope[actions] = !$scope[actions]
                };

                $scope.cancel = function () {
                    $scope.selected = null;
                    $scope.retrieveTokens()
                };

                $scope.destroyPublicSale = function ($index) {
                    $scope.deleted = $scope.publicSales.splice($index, 1);
                    tokens.sendTokens($scope.deleted)
                        .success(function() {
                            $scope.message({ message: ["Item successfully deleted"] });
                            $scope.retrieveTokens()
                        })
                        .error(function (resp) {
                            console.log(resp)
                        })
                };

                $scope.destroyPreSale = function ($index) {
                    $scope.deleted = $scope.preSales.splice($index, 1);
                    tokens.sendTokens($scope.deleted)
                        .success(function() {
                            $scope.message({ message: ["Item successfully deleted"] });
                            $scope.retrieveTokens()
                        })
                        .error(function (resp) {
                            console.log(resp)
                        })
                };

                $scope.switchPublic = function () {
                  tokens.switchSale($scope.password)
                      .success(function(resp) {
                          $scope.preSales = resp.preSale;
                          $scope.publicSales = resp.publicSale;
                          $scope.isPublicSale = resp.isPublicSale;
                          $scope.checkSale = resp.isPublicSale;
                          $scope.message({ message: ["Successfully switched"] });
                      })
                      .error(function(err) {
                          $scope.errors({ errors: [err.message] });
                      })
                };
                
                $scope.passwordAlert = function () {
                    SweetAlert.swal({
                        title: "Please enter your password",
                        text: "",
                        type: "input",
                        inputType: "password",
                        showCancelButton: true,
                        inputPlaceholder: "Password",
                        confirmButtonColor: "#DD6B55",confirmButtonText: "Send",
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        customClass: "confirm-only"},
                    function(value) {
                        if (value) {
                            $scope.password = value;
                            $scope.switchPublic();
                            SweetAlert.close();
                        }
                    })
                }



            }])
}());