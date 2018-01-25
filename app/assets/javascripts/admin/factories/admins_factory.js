(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('AdminsFactory', ['$http', function($http){
        return {

            postEmail: function(email){
                var url = '/api/admin';
                var body = {email: email};
                return $http.post(url, body);
            },

            createPassword: function(password, token, code){
                var url = '/api/admin/confirm';
                var body = {newPassword: password, token: token, code: code};
                return $http.put(url, body);
            }

        }
    }])
}());