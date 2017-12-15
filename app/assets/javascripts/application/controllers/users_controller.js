(function () {

    "use strict";

    angular.module('KoraICOFrontendApp')
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

            if ($state.current.name == 'register') {
                $('body').css({ minWidth: "400px" });

                $scope.user = {};
                $scope.slide = 0;
                $scope.invalid_fields = [];
                $scope.countries  = [];
                $scope.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,}$/;

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

                $scope.agree = function() {
                    var isCaptchaChecked = (grecaptcha && grecaptcha.getResponse().length !== 0);
                    var error = false;

                    if(!$scope.user.agree1 || !$scope.user.agree2) {
                        $scope.errors({ errors: ["Please Agree"] });
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

                    if (error) return;

                    $scope.next();
                };

                $scope.ethereum = function(){
                    $scope.processing = true;
                    if (!$scope.user.sendingEthereumAddress) {
                        $scope.errors({ errors: ["Sending Ethereum Address must be present!"] });
                        return;
                    }
                    else{
                        users.checkUserInfo(_.pick($scope.user, 'sendingEthereumAddress'))
                    }
                    // if (!$scope.user.receivingEthereumAddress) {
                    //   $scope.$parent.errors({ errors: ["Receiving Ethereum Address must be present!"] });
                    //   return;
                    // }
                    // else{
                    //   users.checkUserInfo(_.pick($scope.user, 'receivingEthereumAddress'))
                    // }
                    $scope.getQR();
                    $scope.processing = false;
                    $scope.next();
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
                                $scope.openDialog();
                            }
                        });
                };

                $scope.openDialog = function () {
                    SweetAlert.swal({
                            title: "You are used ip from USA",
                            text: "We have detected you have a US IP, Can you confirm you're not a US citizen?",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",confirmButtonText: "Confirm",
                            cancelButtonText: "Cancel!",
                            closeOnConfirm: true,
                            closeOnCancel: true },
                        function(confirm){
                            if (!confirm) {
                                $state.go('login')
                            }
                        }
                    );
                };

                $scope.confirm = function(){
                    $scope.submitted = true;
                    $scope.formPending = true;
                    users.confirm($scope.user)
                        .success(function(data){
                            $scope.formPending = false;
                            $scope.$parent.current_user = data;
                            $state.go('dashboard');
                        })
                        .error(function(data){
                            $scope.formPending = true;
                            $scope.errors({ errors: [data.message] });
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

          $scope.profileUpdate = function(){
            $scope.processing = true;
            users.upsert($scope.current_user)
              .success(function(){
                $scope.processing = false;
              })
              .error(function(data){
                $scope.processing = false;
                $scope.validation_errors = data.validation_errors
              })
          };
        }])
}());