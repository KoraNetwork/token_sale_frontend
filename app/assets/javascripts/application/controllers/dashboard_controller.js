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
                        title: $stateParams.emailVerified ? "Successful email verification" : "Email verification failed",
                        text: $stateParams.emailVerified ? "Congratulation, your email was verified." : "Seems that something went wrong. Please try ti verify again",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        width: 600,
                        padding: 100,
                        closeOnConfirm: true,
                        customClass: "confirm-only" + ($stateParams.emailUnverified ? " text-error" : "") },
                    function(inputValue) {
                        if (inputValue) {
                            window.location.hash = '#/';
                        }
                    })
            }


            $scope.$parent.retrieveTransactions();

            $scope.ethVerified = function () {
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

            $scope.btcVerified = function () {
                if ($scope.$parent.current_user.verified) {
                    ngDialog.open({
                        templateUrl: 'application/templates/home/btc_dialog.html',
                        className: 'ngdialog-theme-default buy-width',
                        scope: $scope,
                        controller: 'DashboardController'
                    });
                }
                else {
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

            $scope.ethDialog = function () {
                if ($scope.current_user.ethEmpty == null) {
                    SweetAlert.swal({
                            title: "It seems like you don't have Ethereum adress in your profile.",
                            html: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            width: 600,
                            padding: 100,
                            closeOnConfirm: true
                        }
                    );
                }
                else {
                    $scope.ethVerified();
                }
            };

            $scope.btcDialog = function () {
                if ($scope.current_user.btcEmpty == null) {
                  SweetAlert.swal({
                          title: "It seems like you don't have Bitcoin adress in your profile.",
                          html: true,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "OK",
                          width: 600,
                          padding: 100,
                          closeOnConfirm: true
                      }
                  );
              }
              else {
                    $scope.btcVerified();
                }
            };
        }])
}());