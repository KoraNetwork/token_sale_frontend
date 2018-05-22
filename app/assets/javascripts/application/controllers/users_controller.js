(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
        .controller('UsersController', ['$scope', '$state', 'ngDialog', 'toaster', '$stateParams', '$q', '$timeout', 'SweetAlert',
            '$sce', 'UsersFactory',
        function ($scope, $state, ngDialog, toaster, $stateParams, $q, $timeout, SweetAlert, $sce, users) {
            $scope.I18n = I18n;
            $scope._ = _;
            $scope.$state = $state;
            $scope.$stateParams = $stateParams;
            $scope.countries = [];
            $scope.onfidoImage = {};
            $scope.userNameAvailable = true;
            $scope.onfidoVerified = false;

            $(document).ready(
                $q(function (resolve) {
                    resolve($scope.current_user)
                }).then(function (el) {
                    $("#phone").intlTelInput({
                        nationalMode: false,
                        initialCountry: "auto",
                        allowDropdown: $scope.current_user && $scope.current_user.verified ? false : true,
                        geoIpLookup: function (callback) {
                            $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                                var countryCode = (resp && resp.country) ? resp.country : "";
                                callback(countryCode);
                            });
                        }
                    })
                })
            );

            $("#phone").on("change", function() {
                $scope.$apply(function () {
                    $scope.current_user.phone = $("#phone").intlTelInput("getNumber");
                })
            });

            $scope.check = function () {
                users.profile()
                    .success(function (resp) {
                        $scope.selects();
                        $scope.current_user = resp;
                        $scope.current_user.document = $scope.current_user.documentUrl;
                        if(resp && !resp.phone) {
                            $("#phone").intlTelInput({
                                customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
                                    $scope.dialCode = selectedCountryData.dialCode;
                                    return selectedCountryPlaceholder;
                                }
                            });
                        } else {
                            $("#phone").intlTelInput("setNumber", '+' + resp.phone);
                        }
                    })
            };

            $scope.generateOnfido = function () {
                users.checkOnfido()
                    .success(function(resp){
                        var onfidoOut = Onfido.init({
                            token: resp.token,
                            containerId: 'onfido-mount',
                            onComplete: function() {
                                $scope.createOnfido()
                                  .success(function () {
                                    onfidoOut.tearDown();
                                    ngDialog.closeAll();
                                    $scope.closeOnComplete();
                                    $scope.onfidoVerified = true;
                                  });
                            },
                            language: {
                                locale: 'us'
                            },
                            steps: [
                                'document',
                                'face'
                            ]
                        });
                    })
                    .error(function(resp){
                        console.log(resp)
                    })
            };

            $scope.onfidoDialog = function () {
                ngDialog.open({
                    templateUrl: 'application/templates/users/onfido_dialog.html',
                    className: 'ngdialog-theme-default onfido-width',
                    animation: "slide-from-top",
                    closeOnConfirm: true,
                    scope: $scope,
                    controller: 'UsersController'
                });
            };

            $scope.createOnfido = function () {
              users.completeOnfido()
                  .success(function(resp) {
                      $scope.current_user.onfidoImage = resp.documentUrl;
                      window.location.reload();
                  })
                  .error(function(err) {
                      console.log(err)
                  })
            };

            $scope.renderOnfido = function () {
              if (!$scope.onfidoVerified) {
                $q(function (resolve) {
                  resolve($scope.onfidoDialog())
                }).then(function (el) {
                  $scope.generateOnfido()
                })
              }
            };

            $scope.verificationStatus = function () {
                $q(function (resolve){
                    resolve($scope.current_user)
                }).then(function () {
                    if ($scope.current_user.verified) {
                        $scope.current_user.verStatus = 'Verified'
                    }
                    if ($scope.current_user.needVerify && !$scope.current_user.verified) {
                        $scope.current_user.verStatus = 'Submitted'
                    }
                    if (!$scope.current_user.needVerify && !$scope.current_user.verified) {
                        $scope.current_user.verStatus = 'Verify Now'
                    }
                });
            };

            $scope.verificationStatus();

            $scope.closeOnComplete = function () {
                SweetAlert.swal({
                        title: "Verification Submitted",
                        confirmButtonColor: "#DD6B55",confirmButtonText: "Confirm",
                        closeOnConfirm: true},
                    function(confirm){
                        if (confirm) {
                            $state.go('verify_id');
                        }
                    }
                );
            };

            $scope.zoomImage = function(image){
                $scope.image = [image];
                ngDialog.closeAll();
                ngDialog.open({
                    templateUrl: 'application/templates/users/preview_document.html',
                    scope: $scope,
                    className: 'gallery-dialog'
                });
            };

            if (!$scope.current_user) {
                $scope.current_user = {};
            }

            if ($state.current.name == 'register' || $state.current.name == 'us_register') {
                $('body').css({ minWidth: "400px" });

                $scope.user = {};
                $scope.slide = 0;
                $scope.invalid_fields = [];
                $scope.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                $scope.onlyLetters = /^[A-Za-z]+[A-Za-z\-\s]*[A-Za-z]$/;

                // users.checkInwite($stateParams.token)
                //     .error(function () {
                //         $state.go('login')
                //     });

                if ($stateParams.email) {
                    $scope.user.email = $stateParams.email;
                }

                if ($stateParams.token) {
                    $scope.user.inviteToken = $stateParams.token;
                }

                $scope.validate = function() {
                    var validation = users.validate($scope.user);
                    var isCaptchaChecked = (grecaptcha && grecaptcha.getResponse().length !== 0);

                    if (validation) {
                        $scope.invalid_fields = validation.invalidFields;
                        $scope.errors({ errors: validation.messages });
                        return;
                    }
                    if(!$scope.user.agree2) {
                      $scope.errors({ errors: ["Please click I am not a US citizen"] });
                      return;
                    }
                    if(!isCaptchaChecked) {
                      $scope.errors({ errors: ["You have to check the reCaptcha"] });
                      return;
                    }

                    $scope.processing = true;
                    $scope.checkUserInfo(_.pick($scope.user, 'email'));
                };

                $scope.disableUserName = function () {
                    users.disableMVPCode()
                        .success(function () {
                            $scope.checked = $('#username-on-off-switch').is(':checked');
                            if ($scope.checked) {
                                $scope.userNameAvailable = true;
                                $scope.user.userName = '';
                            } else {
                                $scope.userNameAvailable = false;
                                $scope.user.userName = '';
                            }
                        })
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
                            $scope.getQR();
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
                }, 1500);

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
                    // var isCaptchaChecked = (grecaptcha && grecaptcha.getResponse().length !== 0);
                    var error = false;

                    if(!$scope.user.agree1) {
                        $scope.errors({ errors: ["Please,  read and agree with the Whitepaper, the Simple Agreement for Future Tokens, and the Privacy Policy documents."] });
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
                    // if(!isCaptchaChecked) {
                    //     $scope.errors({ errors: ["You have to check the reCaptcha"] });
                    //     $scope.invalid_fields.push('captcha');
                    //     error = true;
                    // }
                    if ($state.current.name != 'us_register') {
                        // if(!$scope.user.agree2) {
                        //     $scope.errors({ errors: ["Please click I am not a US citizen"] });
                        //     error = true;
                        // }
                        if ($scope.user.nationalityObj.countryCode === 'USA' || $scope.user.countryObj.countryCode === 'USA') {
                            $scope.usaCountryDialog();
                            error = true;
                        }
                    }
                    if ($scope.userNameAvailable && $scope.checked) {
                        $scope.errors({ errors: ["Verify your Username first"] });
                        error = true;
                    }
                    if ($scope.checked && !$scope.user.userName) {
                        $scope.errors({ errors: ["Please enter valid UserName"] });
                        error = true;
                    }

                    if (error) return;

                    $scope.next();
                };

                $scope.withUserName = function () {
                    if (!$scope.user.checked || !$scope.userNameAvailable) return;
                    users.isRegisteredMVPUser($scope.user.userName)
                        .success(function (resp) {
                            $scope.userNameAvailable = false;
                            $scope.message({ message: [resp.message] });
                        })
                        .error(function (resp) {
                            $scope.userNameAvailable = true;
                            $scope.errors({ errors: [resp.message] });
                        })
                };

                // $scope.ethereum = function(){
                //     $scope.processing = true;
                //     if (!$scope.user.sendingEthereumAddress && !$scope.user.bitcoinAddress) {
                //         $scope.errors({ errors: ["Sending Ethereum or Bitcoin Address must be present!"] });
                //         return;
                //     }
                //     else{
                //         users.checkUserInfo(_.pick($scope.user, 'sendingEthereumAddress' || $scope.user, 'bitcoinAddress'))
                //           .success(function(){
                //             $scope.getQR();
                //             $scope.next();
                //           })
                //           .error(function(resp){
                //               if (resp.Errors) {
                //                   $scope.parseErrors(resp);
                //               }
                //               else {
                //                   $scope.errors({ errors: [resp.message] })
                //               }
                //           })
                //     }
                //     $scope.processing = false;
                // };

                $scope.getQR = function(){
                    users.getQR()
                        .success(function(data){
                            $scope.qr = data;
                        })
                        .error(function(data){

                        })
                };

                $scope.isUsaIp = function (response) {
                    if ($state.$current.name != 'us_register') {
                        users.verifyIp(response)
                            .success(function (data) {
                                if(data.hasUSIP === true){
                                    $scope.openUsaIpDialog();
                                    return false
                                }
                            });
                    }
                };

                $scope.openUsaIpDialog = function () {
                    SweetAlert.swal({
                            title: "<span>You are using an IP from the USA</span>",
                            text: "<span>We have detected you have a US IP, Please contact us at <a href='mailto:contributors@kora.network'> investors@kora.network <a>.</span>",
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
                    if (!$scope.user) {
                        return $scope.errors({ errors: ['Please provide GA code'] });
                    }
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
                                $scope.parseErrors(data);
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

            // if ($state.current.name === 'login') {
            //     $scope.user = {};
            //
            //     $scope.takeCountries = function () {
            //         users.getCountry()
            //             .success(function (data) {
            //                 $scope.countries = data;
            //             });
            //     };
            //
            //     $scope.whiteList = function () {
            //         $scope.takeCountries();
            //         ngDialog.open({
            //             templateUrl: 'application/templates/sessions/whitelist_dialog.html',
            //             className: 'ngdialog-theme-default whitelist-width',
            //             animation: "slide-from-top",
            //             closeOnConfirm: true,
            //             scope: $scope
            //         });
            //     };
            //
            //     $scope.sendWhitelist = function () {
            //         users.whitelist($scope.user)
            //             .success(function (resp) {
            //                 console.log(resp)
            //             })
            //             .error(function (err) {
            //                 console.log(err)
            //             })
            //     }
            // }

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
                      closeOnCancel: true,
                      customClass: "confirm-only" },
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
                  $scope.current_user.oldPassword = undefined;
                  $scope.current_user.newPassword = undefined;
                  $scope.current_user.newPasswordConfirm = undefined;
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
                if (!$scope.current_user.phone) {
                    $scope.errors({ errors: ["Phone number must be set"] });
                    return;
                }
                if (!$scope.current_user.lastName) {
                  $scope.errors({ errors: ["Last Name number must be set"] });
                  return;
                }
                if (!$scope.current_user.firstName) {
                  $scope.errors({ errors: ["First Name number must be set"] });
                  return;
                }
                $scope.processing = true;
                $scope.current_user.country = $scope.current_user.countryObj.countryCode;

              !function(a,e,d,m,t){a.adm={};a.adm.pixid=134763;
                var o=e.getElementsByTagName("head")[0],c=e.createElement("script");
                a.adm.json="//ps.l.admedo.com/43e28599-82f4-48de-a561-8e2848e0c76a.json",
                  a.adm.pixurl="//pool.admedo.com",c.src="//pj.l.admedo.com/admtracker.lib.min.js",
                    c.async=!0,o.appendChild(c)}(window,document);

              users.verifyID($scope.current_user)
                  .success(function(resp){
                    $scope.processing = false;
                    $scope.current_user = resp;
                    $scope.current_user.document = $scope.current_user.documentUrl;
                    $scope.verifiedID();
                  })
                  .error(function(resp){
                    $("#phone").intlTelInput("setNumber", '+' + $scope.current_user.phone);
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
                        title: "Thank you for submitting your ID.",
                        text: "After it has been verified, you will see a change in status in the sidebar.",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Close",
                        closeOnConfirm: true},
                    function(confirm){
                        if (confirm) {
                            $scope.selects();
                            $scope.check();
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

            $scope.selects = function () {
                $q(function (resolve) {
                    resolve($scope.current_user)
                }).then(users.getSelect()
                    .success(function (data) {
                        $scope.countries = data.country;
                        _.map( $scope.countries, function(el) {
                            if (el.countryCode === $scope.current_user.documentCountry){
                                $scope.current_user.documentCountryObj = el
                            }
                            if (el.countryCode === $scope.current_user.country) {
                                $scope.current_user.countryObj = el
                            }
                        });
                        $scope.identificationTypes = data.identificationType;
                        _.map( $scope.identificationTypes, function(el) {
                            if (el.id === $scope.current_user.identificationType){
                                $scope.current_user.identificationTypeObj = el
                            }
                        });
                    })
                    .error(function (err) {

                    }))
            };

            $scope.$watch('$state.current.name', function(state){
                if(state === 'verify_id') {
                    $scope.check()
                }
            });

            $scope.checkHistory = function () {
              users.getHistory()
                  .success(function(resp) {
                      $scope.ethereums = resp.sendingEthereumAddress;
                      $scope.bitcoins = resp.bitcoinAddress;
                  })
            };

            $scope.checkHistory();


            $scope.dateOfBirth = function () {
                return $scope.current_user.dateOfBirth ?
                    moment($scope.current_user.dateOfBirth).format('DD MMM YYYY') : ''
            };

            $scope.updateProfile = function(){
                $scope.processing = true;

                // if(!$scope.current_user.sendingEthereumAddress && !$scope.current_user.bitcoinAddress) {
                //     $scope.errors({ errors: ['Sending Ethereum or Bitcoin Address must be present!'] });
                //     return
                // }
                users.upsert(_.pick($scope.current_user, 'email'))
                  .success(function(resp){
                    $scope.processing = false;
                    $scope.message({ message: ["Your profile has been successfully updated"] });
                    $state.go('dashboard');
                  })
                  .error(function(data){
                    $scope.processing = false;
                    if (data.Errors) {
                        $scope.parseErrors(data);
                    } else {
                        $scope.errors({ errors: [data.message] });
                    }
                  })
            };

            $scope.options = {
                showWeeks: false,
                formatMonth: 'MMM',
                datepickerMode: 'year',
                show_button_bar: true,
                maxDate: new Date(new Date().getTime() - 4384 * 24 * 60 * 60 * 1000),
                initDate: new Date(new Date().getTime() - 4384 * 24 * 60 * 60 * 1000)
            };
            
            $scope.CheckNumber = function (val) {
                val.zip = val.zip.replace(/[^\d\.]+/g,'');
                val.phone = val.phone.replace(/[^\d\.]+/g,'')
            };
        }])
}());