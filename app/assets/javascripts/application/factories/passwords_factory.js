(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('PasswordsFactory', ['$http', function($http){
        return {
            forgot: function(email){
                return $http.post('/api/profile/forgotPassword?email=' + email);
            },

            reset: function(password, token){
                var url = '/api/profile/restorePassword/' + token;
                var body = {new_password: password};
                return $http.put(url, body);
            },

            create: function (options) {
                return $http.put('/api/profile/confirm', options);
            }
        }
    }])
}());