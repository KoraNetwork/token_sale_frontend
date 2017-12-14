(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('TransactionsFactory', ['$http', function($http){
        return {
            all: function(options){
                var request = '/api/transactions?';

                if (options.page) {
                    request += 'page=' + options.page;
                }

                _.each(Object.keys(options.query), function(key){
                    if(options.query[key])
                        request += key + '=' + options.query[key] + '&';
                });

                return $http.get(request);
            }
        }
    }])
}());