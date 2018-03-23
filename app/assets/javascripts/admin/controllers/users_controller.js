(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', 'UsersFactory', 'toaster', '$stateParams',
            '$timeout', 'SweetAlert',
        function ($scope, $state, ngDialog, users, toaster, $stateParams, $timeout, SweetAlert) {
            $scope.I18n = I18n;
            $scope.$state = $state;
            $scope._ = _;
            $scope.moment = moment;
            $scope.$state = $state;
            $scope.users = [];
            $scope.user = {};
            $scope.knts = [];

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

            $('body').css({ minWidth: "1260px" });

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
                                    $scope.errors({ errors: [data.message] });
                                });
                        } else {
                            if (inputValue !== false) {
                                $scope.errors({ errors: ["Please enter Email !"] });
                            }
                        }
                    });
            };

            if ($state.current.name == 'users') {

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

                $scope.verifyUser = function (user) {
                    if(user) user.Selected = true;
                    users.verify(user ? [user] : $scope.users)
                        .success(function () {
                            $scope.retrieveUsers();
                            $scope.message({ message: ["Complete"] })
                        })
                        .error(function (err) {
                            $scope.errors({ errors: [err.message] });
                        })
                };

                $scope.checkAll = function () {
                    if ($scope.selectedAll) {
                        $scope.selectedAll = true;
                    } else {
                        $scope.selectedAll = false;
                    }
                    angular.forEach($scope.users, function (item) {
                        item.Selected = $scope.selectedAll;
                    });
                };

                $scope.blockedUser = function (id, index) {
                    users.blockChange(id)
                        .success(function (resp) {
                            $scope.users[index] = resp[0];
                            $scope.retrieveUsers()
                        })
                        .error(function (err) {
                            $scope.errors({ errors: [err.message] });
                        })
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
                if ($scope.user.token == undefined) {
                    return $scope.errors({ errors: ['Please provide Code'] })
                } else if ($scope.user.password == undefined) {
                    return $scope.errors({ errors: ['Please provide Password'] })
                }
                users.regenerate(_.pick($scope.user, 'token', 'password'))
                  .success(function(data) {
                      $scope.user.token = undefined;
                      $scope.user.password = undefined;
                      $scope.regenerate = data;
                      $scope.reenableDialog()
                  })
                  .error(function(resp) {
                      if (resp.message == 'Password is invalid') {
                          $scope.errors({ errors: [resp.message] })
                      } else {
                          $scope.errors({ errors: ['Code is Invalid'] })
                      }
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
                            $scope.errors({ errors: users.parseErrors(data.Errors).messages });
                        })
                };

                $scope.allocate = function () {
                    $scope.formPending = true;

                    if (!$scope.knt) {
                        $scope.formPending = false;
                        $scope.errors({ errors: ["Please enter amount!"] });
                        return;
                    }

                    users.allocate($stateParams.id, $scope.knt)
                        .success(function(data){
                            $scope.formPending = false;
                            $scope.knt = undefined;
                            $scope.allocateHistory();
                            $scope.message({ message: ["KNT successfully sent"] })
                        })
                        .error(function(data){
                            $scope.formPending = false;
                        })
                };

                $scope.deleteKnt = function () {
                    users.allocate($stateParams.id, '-' + $scope.removeKnt)
                        .success(function (resp) {
                            $scope.message({message: ["Successfully removed"]})
                        })
                        .error(function (err) {
                            $scope.errors({errors: [err.message]})
                        })
                };

                $scope.deleteBonusKnt = function () {
                    users.removeBonus($stateParams.id, '-' + $scope.removeBonusKnt)
                        .success(function (resp) {
                            $scope.message({message: ["Successfully removed"]})
                        })
                        .error(function (err) {
                            $scope.errors({errors: [err.message]})
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

                $scope.openReport = function () {
                    ngDialog.open({
                        templateUrl: 'admin/templates/home/report.html',
                        className: 'ngdialog-theme-default report-width',
                        animation: "slide-from-top",
                        closeOnConfirm: true,
                        scope: $scope,
                        controller: 'UsersController'
                    });
                }
            }
        }])
}());