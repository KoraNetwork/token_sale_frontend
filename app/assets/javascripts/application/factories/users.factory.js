(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('UsersFactory', ['$http', function($http){
        return {
            register: function(user){
                return $http.post('/api/registration/userInfo', user || {});
            },

            ethereum: function(ethereumAddress){
                return $http.post('/api/registration/userInfo', { ethereumAddress: ethereumAddress });
            },

            getQR: function(){
                return $http.get('/api/registration/generateQRCode');
            },

            confirmQR: function(token){
                return $http.put('/api/registration/confirmQRCode', { token: token });
            }
        }
    }])
}());