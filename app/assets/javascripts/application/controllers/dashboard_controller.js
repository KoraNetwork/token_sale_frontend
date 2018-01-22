(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('DashboardController', ['$scope', '$state', '$stateParams', 'ngDialog', 'SessionsFactory', '$timeout', 'SweetAlert', 'toaster',
            'TransactionsFactory',
            function ($scope, $state, $stateParams, ngDialog, session, $timeout, SweetAlert, toaster, transactions) {

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

            if ($stateParams.emailVerified || $stateParams.emailUnverified) {
                SweetAlert.swal({
                        title: "Email verification",
                        text: $stateParams.emailVerified ? "Thank you for verifying your email." : "User have not verified his email",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        width: 600,
                        padding: 100,
                        closeOnConfirm: true,
                        customClass: "confirm-only" },
                    function(inputValue) {
                        if (inputValue) {
                            window.location.hash = '#/';
                        }
                    })
            }


            $scope.$parent.retrieveTransactions();

            $scope.ethDialog = function () {
              if ($scope.$parent.current_user.verified) {
                  ngDialog.open({
                      templateUrl: 'application/templates/home/eth_dialog.html',
                      className: 'ngdialog-theme-default buy-width',
                      scope: $scope,
                      controller: 'DashboardController'
                  });
              } else {
                  SweetAlert.swal({
                          title: "Verify your ID",
                          text: "Please verify your ID firstly.",
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "OK",
                          width: 600,
                          padding: 100,
                          closeOnConfirm: true
                      }
                  );
              }
            };

            $scope.btcDialog = function () {
              if ($scope.$parent.current_user.verified) {
                  ngDialog.open({
                      templateUrl: 'application/templates/home/btc_dialog.html',
                      className: 'ngdialog-theme-default buy-width',
                      scope: $scope,
                      controller: 'DashboardController'
                  });
              } else {
                  SweetAlert.swal({
                          title: "Verify your ID",
                          text: "Please verify your ID firstly.",
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "OK",
                          width: 600,
                          padding: 100,
                          closeOnConfirm: true
                      }
                  );
              }
            };
        }])
}());