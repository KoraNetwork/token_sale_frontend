(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('PasswordsFactory', ['$http', function($http){
        return {
            forgot: function(email){
                return $http.post('/api/profile/forgotPassword?email=' + email);
            },
            reset: function(password, token){
                var url = '/api/profile/restorePassword/' + token;
                var body = {newPassword: password};
                return $http.put(url, body);
            }
        }
    }])
}());