(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('UsersFactory', ['$http', function($http){
        return {
            checkUserInfo: function (user) {
                return $http.post('/api/registration/checkUserInfo', user || {});
            },

            getQR: function () {
                return $http.put('/api/registration/generateQRCode');
            },

            confirm: function (user) {
                if(user.nationalityObj){
                  user.nationality = user.nationalityObj.countryCode
                }
              if(user.countryObj){
                user.country = user.countryObj.countryCode
              }
              if(user.token){
                user.token = user.token.replace(/\s/g,'');
              }
                return $http.post('/api/registration/confirm', user || {});
            },

            getCountry: function () {
              return $http.get('/api/countries')
            },

            verifyReCaptcha: function (value) {
              return $http.put('/api/registration/validateCaptcha?response=' + value );
            },

            verifyIp: function () {
              return $http.put('/api/registration/checkIp')
            },

            disableMVPCode: function () {
              return $http.put('/api/registration/disableMVPCode')
            },

            sendMVPCode: function (value) {
              return $http.put('/api/registration/sendMVPCode?userName=' + value)
            },

            verifyMVPCode: function (value) {
              return $http.put('/api/registration/verifyMVPCode?code=' + value)
            },

            getRegenerate: function (value) {
              return $http.put('/api/authenticator/regenerate?token=' + value)
            },

            getRegenable: function (value) {
                if(value.reToken){
                    user.reToken = user.reToken.replace(/\s/g,'');
                }
              return $http.put('/api/authenticator/reEnable?token=' + value)
            },

            validate: function (user) {
                var invalidFields = [],
                    messages = [],
                    allFieldsPresent = true;

                _.each([
                    'firstName',
                    'lastName',
                    'email',
                    'password',
                    'passwordConfirmation'
                ], function (key) {
                    if (!user[key]) {
                        invalidFields.push(key);
                        allFieldsPresent = false;
                    }
                });

                if (!allFieldsPresent) messages.push('All fields are required');
                if (user.password !== user.passwordConfirmation) {
                    messages.push('Password and Password Confirmation do not match');
                    if (!_.contains(invalidFields, 'password'))
                        invalidFields.push('password');
                    if (!_.contains(invalidFields, 'passwordConfirmation'))
                        invalidFields.push('passwordConfirmation');
                }

                if (invalidFields.length) {
                    return {
                        invalidFields: invalidFields,
                        messages: messages
                    }
                }
            },

            parseErrors: function (errors) {
                var errorMessages = [], keys = [];
                _.each(_.keys(errors), function (key) {
                    keys.push(key);
                    errorMessages = errorMessages.concat(_.map(errors[key], function (i) {
                        return i.message;
                    }))
                });
                return {
                    messages: errorMessages,
                    invalidFields: keys
                };
            },


          upsert: function (user) {
            return $http.put('/api/profile', user);
          }
        }
    }])
}());