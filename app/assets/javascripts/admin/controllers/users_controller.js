(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', 'toaster', '$stateParams', '$timeout', 'SweetAlert',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, toaster, $stateParams, $timeout, SweetAlert, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.moment = moment;
            $scope.$state = $state;
            $scope.users = [];
            $scope.user = {};
            $scope.knts = [];

            $scope.inviteUserDialog = function() {
                SweetAlert.swal({
                        title: "Invite User",
                        text: "Please enter email",
                        type: "input",
                        showCancelButton: true,
                        inputPlaceholder: "Email",
                        confirmButtonColor: "#DD6B55",confirmButtonText: "Invite User",
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        customClass: "show-input" },
                    function(inputValue) {
                        if (inputValue) {
                            users.inviteUS({ email: inputValue })
                                .success(function (data) {
                                    $scope.message({ message: ["Email successfully send."] });
                                    SweetAlert.close();
                                })
                                .error(function (data) {
                                    $scope.errors({ errors: users.parseErrors(data.Errors).messages });
                                });
                        } else {
                            $scope.errors({ errors: ["Please enter Email !"] });
                        }
                    });
            };

            if ($state.current.name == 'users') {

                $scope.openCreateUserDialog = function () {

                    $scope.filterCountries = function (q) {
                        $scope.filteredCountries = $scope.countries.filter(function (item) {
                            return item.name.toLocaleLowerCase().includes((q || '').toLocaleLowerCase())
                        })
                    };

                    users.getCountry()
                        .success(function (data) {
                            $scope.countries = data;
                        });

                    $scope.new_user = {};
                    ngDialog.open({
                        templateUrl: 'admin/templates/users/create_user.html',
                        className: 'ngdialog-theme-default',
                        animation: "slide-from-top",
                        closeOnConfirm: true,
                        scope: $scope
                    });
                };

                $scope.createUser = function () {
                    users.createUser($scope.new_user)
                        .success(function (data) {
                            $scope.message({ message: ["User successfully created."] });
                            ngDialog.closeAll();
                            $scope.retrieveUsers()
                        })
                        .error(function (data) {
                            if (!data.Errors) {
                                $scope.errors({ errors: [data.message] });
                            } else {
                                $scope.errors({ errors: users.parseErrors(data.Errors).messages });
                            }
                        });
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

                var timer = false;

                $scope.$watch('users_filters', function () {
                    if (timer) {
                        $scope.page = 1;
                        $timeout.cancel(timer)
                    }
                    timer = $timeout(function () {
                        $scope.retrieveUsers();
                    }, 500)
                }, true);

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
                        limit: 10,
                        role: 'user'
                    };
                    $scope.page = 1;
                };

                $scope.resetUsersFilters();
                // $scope.retrieveUsers();

                $scope.go = function(id) {
                    window.location.hash = "#/user/" + id;
                };

                $scope.filterUser = function (type) {
                    if(type == 'blocked'){
                        $scope.users_filters.enabled == undefined ? $scope.users_filters.enabled = false :
                            $scope.users_filters.enabled = undefined
                    }else if(type == 'verify'){
                        $scope.users_filters.needVerify == undefined ? $scope.users_filters.needVerify = true :
                            $scope.users_filters.needVerify = undefined
                    }
                };
            }

            $scope.openRegDialog = function () {
                ngDialog.open({
                    templateUrl: 'admin/templates/common/regenerate_dialog.html',
                    className: 'ngdialog-theme-default regenerate-width',
                    animation: "slide-from-top",
                    closeOnConfirm: true,
                    scope: $scope,
                    controller: 'UsersController'
                });
            };

            $scope.sendToken = function () {
                users.regenerate($scope.user.token)
                  .success(function(data) {
                    $scope.regenerate = data;
                    $scope.reenableDialog()
                  })
                  .error(function(resp) {
                    $scope.errors({ errors: [resp.message] })
                  })
            };

            $scope.checkReEnable = function () {
                users.reenable($scope.user.reToken)
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
                  templateUrl: 'admin/templates/common/reenable_dialog.html',
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
                            $scope.message({ message: ["User has been succesfully updated"] });
                            $state.go('users');
                        })
                        .error(function(data){
                            $scope.formPending = false;
                            $scope.errors({ errors: [data]})
                        })
                };

                $scope.allocate = function () {
                    $scope.formPending = true;
                    users.allocate($stateParams.id, $scope.knt)
                        .success(function(data){
                            $scope.formPending = false;
                            $scope.knt = undefined;
                            $scope.allocateHistory();
                        })
                        .error(function(data){
                            $scope.formPending = false;
                        })
                };

                $scope.allocateHistory = function () {
                    users.allocateHistory($stateParams.id)
                        .success(function(data){
                            $scope.knts = data.data;
                        })
                        .error(function(data){

                        })
                };

                $scope.openDocumentCountry = function(){
                    ngDialog.closeAll();
                    ngDialog.open({
                        templateUrl: 'admin/templates/home/document.html',
                        scope: $scope,
                        className: 'gallery-dialog'
                    });
                };
            }
        }])
}());