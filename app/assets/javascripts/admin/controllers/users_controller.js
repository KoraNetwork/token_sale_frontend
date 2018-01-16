(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', 'toaster', '$stateParams', '$timeout', 'SweetAlert',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, toaster, $stateParams, $timeout, SweetAlert, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.$state = $state;
            $scope.users = [];
            $scope.user = {};



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

            $scope.verifyUser = function (id) {
                users.verify(id)
                    .success(function () {
                        $state.reload();
                    })
                    .error(function (resp) {
                        $scope.errors({ errors: [resp.message] });
                    })
            };

            $scope.blockedUser = function (id, index) {
              users.blockChange(id)
                  .success(function (resp) {
                      $scope.users[index] = resp[0]
                  })
                  .error(function (err) {
                      $scope.errors({ errors: [err.message] });
                  })
            };

            $scope.retrieveUsers = function () {
                users.getUsers({page: $scope.page, query: $scope.users_filters}).success(function (data) {
                    $scope.users = data.data;
                    $scope.count = data.count;
                    var pagination = $('#users-pagination');
                    pagination.empty();
                    pagination.removeData('twbs-pagination');
                    pagination.unbind('page');
                    if ($scope.count > 0) {
                        pagination.twbsPagination({
                            totalPages: Math.ceil($scope.count / $scope.users_filters.limit),
                            startPage: $scope.page,
                            prev: '<',
                            next: '>',
                            first: false,
                            last: false,
                            visiblePages: 9,
                            onPageClick: function (event, page) {
                                $scope.page = page;
                                $scope.retrieveUsers();
                            }
                        })
                    }
                }).error(function (data) {
                });
            };

            $scope.resetUsersFilters = function(){
                $scope.users_filters = {
                    limit: 10
                };
                $scope.page = 1;
            };

            $scope.resetUsersFilters();
            $scope.retrieveUsers();

            $scope.go = function(id) {
                window.location.hash = "#/user/" + id;
            };

            $scope.openRegDialog = function () {
                ngDialog.open({
                    templateUrl: 'application/templates/common/regenerate_dialog.html',
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
                  templateUrl: 'application/templates/common/reenable_dialog.html',
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

            if($state.current.name == 'user'){

                $scope.retrieveUser = function () {
                    users.getUser($stateParams.id)
                        .success(function (data) {
                            $scope.user = data;
                        })
                };

                $scope.retrieveUser();

                $scope.update = function(){
                    users.upsert($scope.user)
                        .success(function(data){
                            $scope.formPending = false;
                            $scope.retrieveUser();
                            $scope.message({ message: "User has been succesfully updated" });
                            $state.go('users');
                        })
                        .error(function(data){
                            $scope.formPending = false;
                            $scope.errors({ errors: [data]})
                        })
                };

            }
        }])
}());