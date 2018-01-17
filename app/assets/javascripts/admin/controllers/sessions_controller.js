(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('SessionsController', ['$scope', '$state', 'ngDialog', '$stateParams', '$timeout', 'SweetAlert', '$sce', 'SessionsFactory',
            function ($scope, $state, ngDialog, $stateParams, $timeout, SweetAlert, $sce, sessions) {
                $scope.I18n = I18n;
                $scope._ = _;
                $scope.$state = $state;
                var validate_email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

                $('body').css({ minWidth: "400px" });

                $scope.getHtml = function(html){
                    return $sce.trustAsHtml(html);
                };

                $scope.$parent.checkSession();

                if($scope.$parent.user){
                    $state.go('users');
                }

                if($state.current.name == 'login'){

                    $scope.session = {};

                    $scope.login = function(){
                        $scope.submitted = true;

                        $scope.processing = true;
                        sessions.login($scope.session)
                            .success(function(data){
                                $scope.processing = false;
                                $scope.$parent.checkSession();
                                $scope.$parent.message({ message: data.message });
                            })
                            .error(function(data, status){
                                $scope.processing = false;
                                $scope.$parent.errors({ errors: [data.message] });
                            })
                    };

                    $scope.sendEmail = function () {
                      sessions.authRecovery($scope.session)
                        .success(function(resp) {
                          $scope.session.id = resp.id;
                          $scope.uploadImageDialog();
                        })
                        .error(function(resp) {
                            if (!$scope.session.email) {
                                $scope.errors({ errors: ["Email field cannot be empty"] })
                            }
                            else if (!$scope.session.email.match(validate_email)) {
                                $scope.errors({ errors: ["The email address you entered is not valid"] });
                            }
                            else {
                                $scope.errors({ errors: [resp.message] })
                            }
                        })
                    };

                    $scope.sendImage = function () {
                        console.log($scope.session);
                        sessions.sendImage($scope.session)
                            .success(function() {
                                $scope.recomendAlert();
                                ngDialog.closeAll();
                            })
                            .error(function(resp){
                                $scope.errors({ errors: [resp.message] });
                            })
                    };

                    $scope.recomendAlert = function () {
                      SweetAlert.swal({
                          title: "",
                          text: "We will check the data and send you an email with the updated Authenticator Secret Code. We recommend to change the Authenticator Secret Code after registration.",
                          confirmButtonColor: "#DD6B55",confirmButtonText: "OK",
                          width: 600,
                          padding: 100,
                          closeOnConfirm: true
                        },
                        function(confirm){
                          if (!confirm) {
                            $state.go('login')
                          }
                        }
                      );
                    };

                    $scope.openGAR = function () {
                        ngDialog.open({
                            templateUrl: 'admin/templates/sessions/gar_dialog.html',
                            className: 'ngdialog-theme-default GAR-width',
                            animation: "slide-from-top",
                            closeOnConfirm: true,
                            scope: $scope
                        });
                    };

                    $scope.uploadImageDialog = function () {
                        ngDialog.open({
                            templateUrl: 'admin/templates/sessions/upload_image.html',
                            className: 'ngdialog-theme-default GAR-width',
                            animation: "slide-from-top",
                            closeOnConfirm: true,
                            scope: $scope
                        });
                    };
                }
            }])
}());