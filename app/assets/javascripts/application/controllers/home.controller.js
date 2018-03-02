(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('HomeController', ['$scope', '$state', 'ngDialog', 'SessionsFactory', '$timeout', 'toaster',
            'TransactionsFactory', '$q', '$interval',
            function ($scope, $state, ngDialog, session, $timeout, toaster, transactions, $q, $interval) {

            $scope.I18n = I18n;
            $scope.$state = $state;
            $scope.transactions = [];


            $timeout(function(){
                if($scope.flash.error.length > 0){
                    toaster.pop('error', "", $scope.flash.error);
                }
                if($scope.flash.message.length > 0){
                    toaster.pop('success', "", $scope.flash.message);
                }
            }, 1000);

            $scope.errors = function(data) {
                if(data.errors){
                    for(var i = 0; i < data.errors.length; ++i) {
                        toaster.pop('error', "", data.errors[i]);
                    }
                }
            };

            $scope.message = function(data) {
                if(data.message){
                    for(var i = 0; i < data.message.length; ++i) {
                        toaster.pop('success', "", data.message[i]);
                    }
                }
            };

            $scope.parseErrors = function (resp) {
                $scope.errors({errors: _.flatten(
                    _.map(resp.Errors, function (errs) {
                        return _.map(errs, function(err) {
                            return err.message
                        })
                    })
                )})
            };

              $scope.resetTransactionsFilters = function(){
                $scope.transactions_filters = {
                  limit: 10
                };
                $scope.page = 1;
              };

              $scope.resetTransactionsFilters();

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

            $scope.checkValues = function () {
              transactions.getValues()
                .success(function (data) {
                  $scope.balance = data;
                  $scope.current_user.btcWallet = data.BTCWallet;
                  $scope.current_user.ethWallet = data.ETHWallet;
                })
                .error(function (data) {

                });
            };

            $scope.refreshValues = function () {
                $scope.spin = true;
                $q(function (resolve) {
                    resolve($scope.retrieveTransactions())
                }).then(function (a) {
                    $scope.checkValues()
                }).then(function() {
                    $scope.spin = false;
                });
            };

            $scope.checkSession = function(){
                session.profile()
                  .success(function(data, status){
                      if (data && data.role === 'admin') {
                          $state.go('login');
                          return;
                      }
                      $scope.status = status;
                      $scope.current_user = data;
                      $scope.current_user.document = $scope.current_user.documentUrl;
                      $scope.checkValues();
                      if([
                              'login',
                              'register',
                              'forgot_password',
                              'restore_password',
                              'us_register',
                              'create_password'].indexOf($state.current.name) >= 0){
                          $state.go('dashboard');
                      }
                  })
                  .error(function(data, status){
                      $scope.status = status;
                      $scope.current_user = false;
                      if([
                              'login',
                              'register',
                              'us_register',
                              'forgot_password',
                              'restore_password',
                              'create_password'].indexOf($state.current.name) < 0){
                          $state.go('login');
                      }
                  });
            };

            $scope.watchState = function () {
                if (($scope.status === 401) && (['login',
                                                'register',
                                                'forgot_password',
                                                'restore_password',
                                                'us_register',
                                                'admins_password'].indexOf($state.current.name) < 0) && (!window.location.hash.includes('#/create_password'))) {
                    $state.go('login');
                }
            };

            $interval(function(){
                $scope.watchState();
            }, 2000);

            $scope.deleteAllCookies = function () {
                document.cookie.split(';').forEach(function(c) {
                    document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                });
            };

            if($state.current.name != 'login'){
                $scope.checkSession();
            }

            $scope.$state = $state;

            $scope.logout = function(){
                session.logout()
                    .success(function(resp, status){
                        $scope.status = status;
                        $scope.deleteAllCookies();
                        $scope.current_user = false;
                        $state.go('login')
                    })
            };

            $scope.changeLanguage = function(locale){
                I18n.locale = locale;
            };


        }])
}());