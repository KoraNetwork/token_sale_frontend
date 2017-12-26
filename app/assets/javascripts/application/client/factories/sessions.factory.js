(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('SessionsFactory', ['$http', function($http){
        return {
            profile: function(){
                return $http.get('/api/profile');
            },

            login: function(session){
                return $http.post('/api/auth/login', session || {})
            },

            logout: function(){
                return $http.delete('/api/auth/logout')
            }
        }
    }])
}());