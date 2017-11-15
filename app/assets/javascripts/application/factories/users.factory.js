(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('UsersFactory', ['$http', function($http){
        return {
            checkUserInfo: function (user) {
                return $http.post('/api/registration/checkUserInfo', user || {});
            },

            getQR: function () {
                return $http.get('/api/registration/generateQRCode');
            },

            confirm: function (user) {
                return $http.put('/api/registration/confirm', user || {});
            },

            validate: function (user) {
                var invalidFields = [],
                    messages = [],
                    allFieldsPresent = true;

                _.each([
                    'firstName',
                    'lastName',
                    'userName',
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
                var errorMessages = [];
                _.each(_.keys(errors), function (key) {
                    errorMessages = errorMessages.concat(_.map(errors[key], function (i) {
                        return i.message;
                    }))
                });
                console.log(errorMessages)
                return errorMessages;
            }
        }
    }])
}());