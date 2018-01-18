(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('TokensFactory', ['$http', function($http){
        return {

            getTokens: function () {
                return $http.get('/api/manageTokens')
            }

        }
    }])
}());