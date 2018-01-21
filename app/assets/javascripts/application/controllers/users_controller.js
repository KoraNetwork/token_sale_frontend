(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', 'toaster', '$stateParams', '$timeout', 'SweetAlert',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, toaster, $stateParams, $timeout, SweetAlert, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.$state = $state;


            if ($state.current.name == 'register') {
                $('body').css({ minWidth: "400px" });

                $scope.user = {};
                $scope.slide = 0;
                $scope.invalid_fields = [];
                $scope.countries  = [];
                $scope.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

                $scope.validate = function() {
                    var validation = users.validate($scope.user);
                    if (validation) {
                        $scope.invalid_fields = validation.invalidFields;
                        $scope.errors({ errors: validation.messages });
                        return;
                    }
                    $scope.processing = true;
                    $scope.checkUserInfo(_.pick($scope.user, 'email'));
                };

                $scope.disableUserName = function () {
                  users.disableMVPCode()
                };

                $scope.checkUserName = function () {
                  $scope.formPending = true;
                  users.sendMVPCode($scope.user.userName)
                    .success(function (resp, status) {
                      $scope.resp = resp.message;
                      $scope.status = status;
                      $scope.message({ message: [$scope.resp] });
                      $scope.formPending = false;
                      $scope.verifyCodeDialog();
                    })
                    .error(function (err) {
                      $scope.errors({ errors: [err.message] });
                      $scope.formPending = false;
                    })
                };

                $scope.verifyCode = function () {
                  $scope.formPending = true;
                  users.verifyMVPCode($scope.user.code)
                    .success(function (resp) {
                      $scope.message({ message: [resp.message] });
                      $scope.formPending = false;
                      $scope.closeVerifyDialog();
                    })
                    .error(function (err) {
                      $scope.errors({ errors: [err.message] });
                      $scope.formPending = false;
                    })
                };

                $scope.verifyCodeDialog = function () {
                  ngDialog.open({
                    templateUrl: 'application/templates/users/verify_dialog.html',
                    className: 'ngdialog-theme-default',
                    animation: "slide-from-top",
                    closeOnConfirm: true,
                    scope: $scope,
                    controller: 'UsersController'
                  });
                };

                $scope.closeVerifyDialog = function () {
                  ngDialog.closeAll();
                };

                $scope.checkUserInfo = function (user) {
                    users.checkUserInfo(user)
                        .success(function(){
                            $scope.processing = false;
                            $scope.invalid_fields = [];
                            $scope.next();
                        })
                        .error(function (data) {
                            $scope.processing = false;
                            if (data.Errors) {
                                var errors = users.parseErrors(data.Errors);
                                $scope.errors({ errors: errors.messages });
                                $scope.invalid_fields = errors.invalidFields;
                            }
                        })
                };

                $scope.checkCaptcha = function (capchaResult) {
                    users.verifyReCaptcha(capchaResult)
                        .success(function(data, status){
                            if (status >= 300) {
                                $scope.errors({ errors: ["Please confirm reCaptcha"] });
                                $scope.invalid_fields.push('captcha');
                            }
                        })
                        .error(function () {

                        })
                };

                $scope.renderCaptcha = function () {
                    grecaptcha.render('reCaptcha', {
                        sitekey: "6Lf9ozsUAAAAABxute4OEizhn-8OHMDa258b15W-",
                        callback: function (response) {
                            $scope.checkCaptcha(response)
                        }
                    })
                };

                $timeout(function () {
                    if ($scope.$parent && !$scope.$parent.current_user) {
                        $scope.renderCaptcha();
                    }
                }, 1000);

                $scope.usaCountryDialog = function () {
                    ngDialog.open({
                        templateUrl: 'application/templates/users/usa_country.html',
                        className: 'ngdialog-theme-default regenerate-width',
                        animation: "slide-from-top",
                        closeOnConfirm: true,
                        scope: $scope,
                        controller: 'UsersController'
                    });
                };

                $scope.agree = function() {
                    var isCaptchaChecked = (grecaptcha && grecaptcha.getResponse().length !== 0);
                    var error = false;

                    if(!$scope.user.agree1) {
                        $scope.errors({ errors: ["Please click I have read and agree with the Whitepaper"] });
                        error = true;
                    }
                    if(!$scope.user.agree2) {
                      $scope.errors({ errors: ["Please click I am not a US citizen"] });
                      error = true;
                    }
                    if(!$scope.user.nationalityObj) {
                        $scope.errors({ errors: ["Please select Your Nationality"] });
                        $scope.invalid_fields.push('nationality');
                        error = true;
                    }
                    if(!$scope.user.countryObj) {
                        $scope.errors({ errors: ["Please select Your Country"] });
                        $scope.invalid_fields.push('country');
                        error = true;
                    }
                    if(!isCaptchaChecked) {
                        $scope.errors({ errors: ["You have to check the reCaptcha"] });
                        $scope.invalid_fields.push('captcha');
                        error = true;
                    }
                    if($scope.user.nationalityObj.countryCode === 'USA') {
                        $scope.usaCountryDialog();
                        error = true;
                    }
                    if($scope.user.countryObj.countryCode === 'USA') {
                        $scope.usaCountryDialog();
                        error = true
                    }

                    if (error) return;

                    $scope.next();
                };

                $scope.ethereum = function(){
                    $scope.processing = true;
                    if (!$scope.user.sendingEthereumAddress && !$scope.user.bitcoinAddress) {
                        $scope.errors({ errors: ["Sending Ethereum or Bitcoin Address must be present!"] });
                        return;
                    }
                    else{
                        users.checkUserInfo(_.pick($scope.user, 'sendingEthereumAddress' || $scope.user, 'bitcoinAddress'))
                          .success(function(){
                            $scope.getQR();
                            $scope.next();
                          })
                          .error(function(data){
                            $scope.resp = data;
                            $scope.errors({errors: _.flatten(
                              _.map($scope.resp.Errors, function (errs) {
                                return _.map(errs, function (err) {
                                  return err.message;
                                })
                              })
                            )})
                          })
                    }
                    // if (!$scope.user.receivingEthereumAddress) {
                    //   $scope.$parent.errors({ errors: ["Receiving Ethereum Address must be present!"] });
                    //   return;
                    // }
                    // else{
                    //   users.checkUserInfo(_.pick($scope.user, 'receivingEthereumAddress'))
                    // }
                    $scope.processing = false;
                };

                $scope.getQR = function(){
                    users.getQR()
                        .success(function(data){
                            $scope.qr = data;
                        })
                        .error(function(data){

                        })
                };

                $scope.isUsaIp = function (response) {
                    users.verifyIp(response)
                        .success(function (data) {
                            if(data.hasUSIP === true){
                                $scope.openUsaIpDialog();
                                return false
                            }
                        });
                };

                $scope.openUsaIpDialog = function () {
                    SweetAlert.swal({
                            title: "<span>You are used ip from USA</span>",
                            text: "<span>We have detected you have a US IP, Please contact us at <a href='mailto:investors@kora.network'> investors@kora.network <a>.</span>",
                            html: true,
                            confirmButtonColor: "#DD6B55",confirmButtonText: "Confirm",
                            closeOnConfirm: true},
                        function(confirm){
                            if (confirm) {
                                $state.go('login')
                            }
                        }
                    );
                };

                $scope.confirm = function(){
                    $scope.submitted = true;
                    $scope.formPending = false;
                    users.confirm($scope.user)
                        .success(function(data){
                            $scope.formPending = true;
                            $scope.checkSession();
                            $scope.$parent.current_user = data;
                            $scope.checkValues();
                            location.replace('#/');
                        })
                        .error(function(data){
                            $scope.formPending = false;
                            if(data.Errors) {
                                $scope.parseErrors();
                            }
                            else {
                                $scope.errors({ errors: [data.message] });
                            }
                        })
                };

                $scope.filterCountries = function (q) {
                    $scope.filteredCountries = $scope.countries.filter(function (item) {
                        return item.name.toLocaleLowerCase().includes((q || '').toLocaleLowerCase())
                    })
                };

                users.getCountry()
                    .success(function (data) {
                        $scope.countries = data;
                    });

                $scope.slideHeight = function(selector) {
                    return $(selector).height();
                };

                $scope.next = function() {
                    if($scope.slide < 3) $scope.slide += 1;
                };

                $scope.prev = function() {
                    if($scope.slide) $scope.slide -= 1;
                };

                $scope.removeError = function (key) {
                    var i = $scope.invalid_fields.indexOf(key);
                    if (i > -1) {
                        $scope.invalid_fields.splice(i, 1);
                    }
                };
            }

            $scope.sendToken = function () {
                users.getRegenerate($scope.user)
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

            $scope.regenerateDialog = function () {
                ngDialog.open({
                  templateUrl: 'application/templates/common/regenerate_dialog.html',
                  className: 'ngdialog-theme-default regenerate-width',
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

          $scope.googleAuthAlert = function () {
              SweetAlert.swal({
                      title: "Google Authenticator Code can not be empty",
                      text: "Please enter your Google Authenticator Code:",
                      type: "input",
                      showCancelButton: true,
                      inputPlaceholder: "Google Authenticator",
                      confirmButtonColor: "#DD6B55",confirmButtonText: "Confirm",
                      closeOnConfirm: false,
                      closeOnCancel: true},
                  function(inputValue) {
                      if (inputValue) {
                          $scope.current_user.token = inputValue;
                          $scope.changePassword();
                          SweetAlert.close();
                      }
                  })
          };

          $scope.changePassword = function () {
              $scope.processing = true;
              users.updatePassword($scope.current_user)
                .success(function(resp) {
                  $scope.processing = false;
                  $scope.passwordChanged();
                })
                .error(function(resp) {
                    $scope.errors({ errors: [resp.message] });
                })
            };

            $scope.passwordChanged = function () {
                SweetAlert.swal({
                        title: "Change of password",
                        text: "Your password was changed successfully!",
                        confirmButtonColor: "#DD6B55",confirmButtonText: "Close",
                        closeOnConfirm: true},
                    function(confirm){
                        if (confirm) {
                            $state.go('dashboard');
                            SweetAlert.close();
                        }
                    }
                );
            };

            $scope.verifyID = function(){
                $scope.processing = true;
                $scope.current_user.documentCountry = $scope.current_user.documentCountryObj.countryCode;
                $scope.current_user.identificationType = $scope.current_user.identificationTypeObj.id;
                users.verifyID($scope.current_user)
                  .success(function(resp){
                    $scope.processing = false;
                    // console.log(resp);
                    $scope.verifiedID();
                    // console.log($scope.current_user)
                  })
                  .error(function(resp){
                    $scope.processing = false;
                    if(resp.Errors) {
                        $scope.parseErrors(resp);
                    }
                    else {
                        $scope.errors({ errors: [resp.message] })
                    }
                  })
            };

            $scope.verifiedID = function () {
                SweetAlert.swal({
                        title: "Thank you for verifying your ID",
                        text: "After admins approval, you will see your status in the side bar.",
                        confirmButtonColor: "#DD6B55",confirmButtonText: "Close",
                        closeOnConfirm: true},
                    function(confirm){
                        if (confirm) {
                            $state.go('dashboard');
                            SweetAlert.close();
                        }
                    }
                );
            };

            $scope.filterCountries = function (q) {
                $scope.filteredCountries = $scope.countries.filter(function (item) {
                    return item.name.toLocaleLowerCase().includes((q || '').toLocaleLowerCase())
                })
            };


            $scope.$watch('$state.current.name', function(state){
                if(state === 'verify_id') {
                    $scope.selects();
                }
            });

            $scope.selects = function () {
                $scope.current_user.document = $scope.current_user.documentUrl;
                users.getSelect()
                    .success(function (data) {
                        $scope.countries = data.country;
                        _.map( $scope.countries, function(el) {
                            if (el.countryCode == $scope.current_user.documentCountry){
                                $scope.current_user.documentCountryObj = el
                            }
                        });
                        $scope.identificationTypes = data.identificationType;
                        _.map( $scope.identificationTypes, function(el) {
                            if (el.id == $scope.current_user.identificationType){
                                $scope.current_user.identificationTypeObj = el
                            }
                        });
                    })
                    .error(function (err) {
                        console.log(err)
                    })
            };


            $scope.dateOfBirth = function () {
                return $scope.current_user.dateOfBirth ?
                    moment($scope.current_user.dateOfBirth).format('DD MMM YYYY') : ''
            };

            $scope.updateProfile = function(){
                $scope.processing = true;
                users.upsert(_.pick($scope.current_user, 'email', 'sendingEthereumAddress', 'bitcoinAddress'))
                  .success(function(resp){
                    $scope.processing = false;
                    $scope.message({ message: ["Your profile has been successfully updated"] });
                    $state.go('dashboard');
                  })
                  .error(function(data){
                    $scope.processing = false;
                    $scope.errors({ errors: [data.message] });
                  })
            };

            $scope.options = {
                showWeeks: false,
                formatMonth: 'MMM',
                show_button_bar: false,
                maxDate: new Date(new Date().getTime() - 4384 * 24 * 60 * 60 * 1000),
                initDate: new Date(new Date().getTime() - 4384 * 24 * 60 * 60 * 1000)
            };
        }])
}());