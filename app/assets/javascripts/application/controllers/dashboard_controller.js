(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('DashboardController', ['$scope', '$state', '$stateParams', 'ngDialog', 'SessionsFactory', '$timeout', 'SweetAlert', 'toaster', 'UsersFactory',
            'TransactionsFactory',
            function ($scope, $state, $stateParams, ngDialog, session, $timeout, SweetAlert, toaster, users, transactions) {

            $scope.I18n = I18n;
            $scope.$state = $state;
            $scope.moment = moment;
            $scope.user = {};

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

            $scope.conditionDialog = function () {
              ngDialog.open({
                templateUrl: 'application/templates/home/condition_dialog.html',
                className: 'ngdialog-theme-default condition-width',
                scope: $scope,
                controller: 'DashboardController'
              });
            };

            $scope.confirmCheckbox = function () {
              if(!$scope.checked){
                $scope.errors({ errors: ["Please confirm!"] });
                return
              }
              $scope.current_user.confirmedReading = true;
              users.upsert($scope.current_user)
                .success(function (resp) {
                  $scope.current_user.confirmedReading = resp.confirmedReading;
                  ngDialog.closeAll();
                })
            };

            $scope.ethDialog = function () {
                if (!$scope.current_user.confirmedReading) {
                  $scope.conditionDialog();
                  return
                }
                if ($scope.current_user.ethWallet && !$scope.current_user.ethWallet.address) {
                  SweetAlert.swal({
                      title: "It seems like you don't have Ethereum address in your profile.",
                      text: "Please add your ETH sending address in the Profile tab, so we can track your contribution.",
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "OK",
                      showCancelButton: true,
                      width: 600,
                      padding: 100,
                      closeOnConfirm: true
                    }, function(confirm) {
                      if(confirm) {
                        window.location.hash = '#/profile/update_profile';
                        SweetAlert.close();
                      }
                    }
                  );
                }
                if (!$scope.current_user.ethWallet) {
                  SweetAlert.swal({
                      title: "Verify your ID",
                      text: "Please verify your ID first.",
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "OK",
                      showCancelButton: true,
                      width: 600,
                      padding: 100,
                      closeOnConfirm: true
                    }, function(confirm) {
                      if(confirm) {
                        window.location.hash = '#/profile/verify_id';
                        SweetAlert.close();
                      }
                    }
                  );
                }
                if ($scope.$parent.current_user.verified && !($scope.current_user.ethWallet && !$scope.current_user.ethWallet.address)) {
                  ngDialog.open({
                    templateUrl: 'application/templates/home/eth_dialog.html',
                    className: 'ngdialog-theme-default buy-width',
                    scope: $scope,
                    controller: 'DashboardController'
                  });
                }
            };

            $scope.btcDialog = function () {
                if (!$scope.current_user.confirmedReading) {
                  $scope.conditionDialog();
                  return
                }
                if ($scope.current_user.btcWallet && !$scope.current_user.btcWallet.address) {
                  SweetAlert.swal({
                          title: "It seems like you don't have Bitcoin address in your profile.",
                          text: "Please add your BTC sending address in the Profile tab, so we can track your contribution.",
                          html: true,
                          $scope: $scope,
                          showCancelButton: true,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "OK",
                          width: 600,
                          padding: 100,
                          closeOnConfirm: true
                      }, function(confirm) {
                        if(confirm) {
                            window.location.hash = '#/profile/update_profile';
                            SweetAlert.close();
                        }
                    }
                  );
              }
              if (!$scope.current_user.btcWallet) {
                  SweetAlert.swal({
                          title: "Verify your ID",
                          text: "Please verify your ID first.",
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "OK",
                          showCancelButton: true,
                          width: 600,
                          padding: 100,
                          closeOnConfirm: true
                      }, function(confirm) {
                          if(confirm) {
                              window.location.hash = '#/profile/verify_id';
                              SweetAlert.close();
                          }
                      }
                  );
              }
              if ($scope.$parent.current_user.verified) {
                  ngDialog.open({
                      templateUrl: 'application/templates/home/btc_dialog.html',
                      className: 'ngdialog-theme-default buy-width',
                      scope: $scope,
                      controller: 'DashboardController'
                  });
              }
            };
        }])
}());