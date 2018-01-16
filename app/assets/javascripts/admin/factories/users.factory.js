(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('UsersFactory', ['$http', function($http){
        return {

            getRegenerate: function (value) {
              return $http.put('/api/authenticator/regenerate?token=' + value)
            },

            getRegenable: function (value) {
                if(value.reToken){
                    user.reToken = user.reToken.replace(/\s/g,'');
                }
              return $http.put('/api/authenticator/reEnable?token=' + value)
            },

            getUsers: function (options) {
                var request = '/api/users?';

                if (options.page) {
                    request += 'page=' + options.page + '&';
                }

                _.each(Object.keys(options.query), function(key){
                    if(options.query[key])
                        request += key + '=' + options.query[key] + '&';
                });

                return $http.get(request);
            },

            getUser: function (id) {
                return $http.get('/api/users/' + id);
            },

            upsert: function (user) {

                return $http.put('/api/users/' + user.id, user);
            },

            parseErrors: function (errors) {
                var errorMessages = [], keys = [];
                _.each(_.keys(errors), function (key) {
                    keys.push(key);
                    errorMessages = errorMessages.concat(_.map(errors[key], function (i) {
                        return i.message;
                    }))
                });
                return {
                    messages: errorMessages,
                    invalidFields: keys
                };
            }
        }
    }])
}());