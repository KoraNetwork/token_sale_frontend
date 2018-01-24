(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('GARequestsFactory', ['$http', function($http){
        return {

            index: function (options) {
                var request = '/api/authenticatorRecovery?';

                if (options.page) {
                    request += 'page=' + options.page + '&';
                }

                _.each(Object.keys(options.query), function(key){
                    if(options.query[key])
                        request += key + '=' + options.query[key] + '&';
                });

                return $http.get(request);
            },

            reset: function (id) {
                return $http.post('/api/authenticatorRecovery/' + id);
            },

            destroy: function (id) {
                return $http.delete('/api/authenticatorRecovery/' + id)
            }
        }
    }])
}());