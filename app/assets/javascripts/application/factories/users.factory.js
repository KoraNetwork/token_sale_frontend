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
                user.token = user.token.toString().replace(/\s/g,'');
              }
                return $http.post('/api/registration/confirm', user || {});
            },

            getCountry: function () {
              return $http.get('/api/countries')
            },
            
            getSelect: function () {
                return $http.get('/api/profile/selects')
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
                if(value.token){
                    value.token = value.token.toString().replace(/\s/g,'');
                }
              return $http.put('/api/authenticator/regenerate', value)
            },

            getRegenable: function (value) {
                value = value.toString().replace(/\s/g,'');
              return $http.put('/api/authenticator/reEnable?token=' + value)
            },

            updatePassword: function (value) {
              return $http.put('/api/password/change', value)
            },

            getHistory: function () {
              return $http.get('/api/addressHistory')
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

            verifyID: function (user) {

                var fd = new FormData();

                fd.append('firstName', user.firstName || '');
                fd.append('lastName', user.lastName || '');
                fd.append('phone', user.phone || '');
                fd.append('country', user.countryObj ? user.countryObj.countryCode : '');
                fd.append('dateOfBirth', user.dateOfBirth || '');
                fd.append('streetAddress', user.streetAddress || '');
                fd.append('aptSte', user.aptSte || '');
                fd.append('city', user.city || '');
                fd.append('state', user.state || '');
                fd.append('zip', user.zip || '');
                fd.append('identificationType', user.identificationType || '');
                fd.append('documentCountry', user.documentCountryObj ? user.documentCountryObj.countryCode : '');

                if(user.document && user.document.file){
                    fd.append('document', user.document.file);
                }

                return $http.put('/api/profile/verify', fd, {
                    headers: { 'Content-Type': undefined }
                })
            },

            upsert: function (user) {
                return $http.put('/api/profile', user || {});
            },

            checkOnfido: function () {
                return $http.post('/api/onfido/sdkToken')
            },

            completeOnfido: function () {
                return $http.post('/api/onfido/createCheck')
            },

            whitelist: function (data) {
                console.log('scope users =>', data);
                if(data.nationalityObj){
                    data.nationality = data.nationalityObj.countryCode
                }
                return $http.post('/api/whitelist', data || {})
            },

            isRegisteredMVPUser: function (value) {
                return $http.put('/api/registration/isRegisteredMVPUser?userName=' + value)
            }
        }
    }])
}());