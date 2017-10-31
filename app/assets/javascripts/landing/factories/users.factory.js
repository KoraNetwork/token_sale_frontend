(function () {
    'use strict';
    angular.module('KoraICOFrontendLandingApp').factory('UsersFactory', ['$http', function($http){
        return {
            create: function(user){
                var user_params = {};
                user_params.login = user.login ? user.login : '';
                user_params.password = user.password ? user.password : '';
                user_params.password_confirmation = user.password ? user.password : '';
                user_params.email = user.email ? user.email : '';
                return $http.post('/users', { user: user_params })
            }
        }
    }])
}());