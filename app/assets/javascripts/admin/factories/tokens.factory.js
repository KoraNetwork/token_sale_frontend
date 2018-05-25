(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('TokensFactory', ['$http', function($http){
        return {

            getTokens: function () {
                return $http.get('/api/manageTokens')
            },

            sendTokens: function (data) {
                delete data.id;
                delete data.updatedAt;
                delete data.createdAt;
                return $http.post('/api/manageTokens/sale', data || {})
            },

            switchSale: function (password) {
                return $http.post('/api/manageTokens/switchToPublicSale?password=' + password)
            },

            getAmount: function () {
              return $http.get('/api/amountKNT')
            },

            sendAmount: function (data) {
              return $http.put('/api/amountKNT', data)
            }

        }
    }])
}());