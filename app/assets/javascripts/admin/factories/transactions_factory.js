(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('TransactionsFactory', ['$http', function($http){
        return {
            all: function(options){
                var request = '/api/transactions/findAll?';

                if (options.page) {
                    request += 'page=' + options.page + '&';
                }

                _.each(Object.keys(options.query), function(key){
                    if(options.query[key])
                        request += key + '=' + options.query[key] + '&';
                });

                return $http.get(request);
            },

            filters: function () {
                return $http.get('/api/transactions/filters');
            },

            getWallets: function () {
                return $http.get('/api/koraWallets');
            },

            updateWallets: function (data) {
              return $http.put('/api/koraWallets', data);
            }
        }
    }])
}());