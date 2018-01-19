(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('HomeController', ['$scope', '$state', 'ngDialog', 'SessionsFactory', '$timeout', 'toaster','TransactionsFactory',
            function ($scope, $state, ngDialog, session, $timeout, toaster, transactions) {

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
                })
                .error(function (data) {

                });
            };

            $scope.refreshValues = function () {
              $scope.retrieveTransactions();
              $scope.checkValues();
            };

            $scope.checkSession = function(){
                session.profile()
                  .success(function(data, status){
                      $scope.current_user = data;
                      $scope.checkValues();
                      $state.go('dashboard');
                  })
                  .error(function(data){
                      $scope.current_user = false;
                      if(['login', 'register', 'forgot_password', 'restore_password'].indexOf($state.current.name) < 0){
                          $state.go('login');
                      }
                  });
            };

            if($state.current.name != 'login'){
                $scope.checkSession();
            }

            $scope.$state = $state;

            $scope.logout = function(){
                session.logout().success(function(){
                    window.location = '/'
                })
            };

            $scope.changeLanguage = function(locale){
                I18n.locale = locale;
            };
        }])
}());