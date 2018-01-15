(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', 'toaster', '$stateParams', '$timeout', 'SweetAlert',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, toaster, $stateParams, $timeout, SweetAlert, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.$state = $state;

            $scope.errors = function(data) {
                if(data.errors){
                    for(var i = 0; i < data.errors.length; ++i) {
                        toaster.pop('error', "", data.errors[i]);
                    }
                }
            };

            $scope.message = function(data) {
                if(data.message){
                    toaster.pop('success', "", data.message);
                }
            };

            $scope.openRegDialog = function () {
                ngDialog.open({
                    templateUrl: 'application/client/templates/common/regenerate_dialog.html',
                    className: 'ngdialog-theme-default regenerate-width',
                    animation: "slide-from-top",
                    closeOnConfirm: true,
                    scope: $scope,
                    controller: 'UsersController'
                });
            };

            $scope.sendToken = function () {
                users.getRegenerate($scope.user.token)
                  .success(function(data) {
                    $scope.regenerate = data;
                    $scope.reenableDialog()
                  })
                  .error(function(resp) {
                    $scope.errors({ errors: [resp.message] })
                  })
            };

            $scope.checkReEnable = function () {
                users.getRegenable($scope.user.reToken)
                  .success(function(resp) {
                    $scope.message({ message: [resp.message] });
                    ngDialog.closeAll();
                  })
                  .error(function(resp) {
                    $scope.errors({ errors: [resp.message] })
                  })
            };

            $scope.reenableDialog = function () {
                ngDialog.open({
                  templateUrl: 'application/client/templates/common/reenable_dialog.html',
                  className: 'ngdialog-theme-default reenable-width',
                  animation: "slide-from-top",
                  closeOnConfirm: true,
                  scope: $scope,
                  controller: 'UsersController'
                });
            };

          $scope.openAuthAlert = function () {
              var error = false;

              if(!$scope.current_user.oldPassword) {
                  $scope.errors({errors: ["Old password required"]});
                  error = true
              }
              if(!$scope.current_user.newPassword) {
                  $scope.errors({errors: ["New Password cannot be empty"]});
                  error = true
              }
              if(!$scope.current_user.newPasswordConfirm) {
                  $scope.errors({errors: ["New Password Confirm cannot be empty"]});
                  error = true
              }

              if (error) return;

              $scope.googleAuthAlert();

          };
        }])
}());