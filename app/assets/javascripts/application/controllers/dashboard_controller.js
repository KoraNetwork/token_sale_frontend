(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('DashboardController', ['$scope', '$state', '$stateParams', 'ngDialog', 'SessionsFactory', '$anchorScroll', '$timeout', 'SweetAlert', 'toaster', 'UsersFactory',
            'TransactionsFactory', '$location',
            function ($scope, $state, $stateParams, ngDialog, session, $anchorScroll, $timeout, SweetAlert, toaster, users, transactions, $location) {

            $scope.I18n = I18n;
            $scope.$state = $state;
            $scope.moment = moment;
            $scope.document = {};
            $scope.ng_dialog = {};
            $scope.initialized = false;

            var timer = false;
            $scope.document.date = new Date();
            $scope.document.confirmedReadingTimezoneOffset =  $scope.document.date.getTimezoneOffset();

            $scope.scrollTo = function(id) {
              $location.hash(id);
              $anchorScroll();
            };

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

            $scope.withdraw = function () {
              SweetAlert.swal({
                  title: "Token sale is over.",
                  text: "Withdrawal KNT cooming soon.",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "OK",
                  width: 600,
                  padding: 100,
                  closeOnConfirm: true
                }, function(confirm) {
                  if(confirm) {
                    SweetAlert.close();
                  }
                }
              );
            };

            $scope.conditionDialog = function () {
              $scope.initialized = true;
              ngDialog.open({
                templateUrl: 'application/templates/home/condition_dialog.html',
                className: 'ngdialog-theme-default condition-width',
                scope: $scope
              });
              $timeout(function() {
                $scope.initialized = false;
              }, 1000);
            };

            $scope.confirmCheckbox = function () {
              if(!$scope.document.firstName){
                $scope.errors({ errors: ["Please enter First name!"] });
                $scope.scrollTo('sectionPurchaser');
                return
              }
              if(!$scope.document.lastName){
                $scope.errors({ errors: ["Please enter Last name!"] });
                $scope.scrollTo('sectionPurchaser');
                return
              }
              $scope.document.confirmedReading = true;
              users.upsert($scope.document)
                .success(function (resp) {
                  $scope.current_user = resp;
                  $scope.document.confirmedReading = resp.confirmedReading;
                  ngDialog.closeAll();
                  if ($scope.enumDialog.includes('eth')) {
                    ngDialog.open({
                      templateUrl: 'application/templates/home/eth_dialog.html',
                      className: 'ngdialog-theme-default buy-width',
                      scope: $scope
                    });
                  }
                  if ($scope.enumDialog.includes('btc') && !$scope.current_user.btcWallet) {
                    ngDialog.open({
                      templateUrl: 'application/templates/home/btc_dialog.html',
                      className: 'ngdialog-theme-default buy-width',
                      scope: $scope
                    });
                  }
                })
            };

            $scope.ethDialog = function ($index) {
                $scope.enumDialog = $index;
                // if ($scope.current_user.ethWallet && !$scope.current_user.ethWallet.address) {
                //   SweetAlert.swal({
                //       title: "It seems like you don't have Ethereum address in your profile.",
                //       text: "Please add your ETH sending address in the Profile tab, so we can track your contribution.",
                //       confirmButtonColor: "#DD6B55",
                //       confirmButtonText: "OK",
                //       showCancelButton: true,
                //       width: 600,
                //       padding: 100,
                //       closeOnConfirm: true
                //     }, function(confirm) {
                //       if(confirm) {
                //         window.location.hash = '#/profile/update_profile';
                //         SweetAlert.close();
                //       }
                //     }
                //   );
                // }
                if (!$scope.current_user.ethWallet && !$scope.current_user.verified) {
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
                if (!$scope.current_user.confirmedReading && $scope.$parent.current_user.verified && $scope.current_user.ethWallet.address) {
                    $scope.conditionDialog();
                    return
                }
                if ($scope.$parent.current_user.verified && !($scope.current_user.ethWallet && !$scope.current_user.ethWallet.address)) {
                  ngDialog.open({
                    templateUrl: 'application/templates/home/eth_dialog.html',
                    className: 'ngdialog-theme-default buy-width',
                    scope: $scope
                  });
                }
            };

            $scope.btcDialog = function ($index) {
                $scope.enumDialog = $index;
              //   if ($scope.current_user.btcWallet && !$scope.current_user.btcWallet.address) {
              //     SweetAlert.swal({
              //             title: "It seems like you don't have Bitcoin address in your profile.",
              //             text: "Please add your BTC sending address in the Profile tab, so we can track your contribution.",
              //             html: true,
              //             $scope: $scope,
              //             showCancelButton: true,
              //             confirmButtonColor: "#DD6B55",
              //             confirmButtonText: "OK",
              //             width: 600,
              //             padding: 100,
              //             closeOnConfirm: true
              //         }, function(confirm) {
              //           if(confirm) {
              //               window.location.hash = '#/profile/update_profile';
              //               SweetAlert.close();
              //           }
              //       }
              //     );
              // }
              if (!$scope.current_user.btcWallet && !$scope.current_user.verified) {
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
              if (!$scope.current_user.confirmedReading && $scope.$parent.current_user.verified && $scope.current_user.btcWallet.address) {
                  $scope.conditionDialog();
                  return
              }
              if ($scope.$parent.current_user.verified) {
                  ngDialog.open({
                      templateUrl: 'application/templates/home/btc_dialog.html',
                      className: 'ngdialog-theme-default buy-width',
                      scope: $scope
                  });
              }
            };
        }])
}());