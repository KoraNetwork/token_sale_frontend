(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('UsersFactory', ['$http', function($http){
        return {

            getRegenerate: function (value) {
              return $http.put('/api/authenticator/regenerate?token=' + value)
            },

            getRegenable: function (value) {
                if(value.reToken){
                    user.reToken = user.reToken.toString().replace(/\s/g,'');
                }
              return $http.put('/api/authenticator/reEnable?token=' + value)
            },

            verify: function (users) {
                var ids = [];
                for(var i = 0; i < users.length; i++) {
                    if(users[i].Selected) {
                        ids.push(users[i].id);
                    }
                }
              return $http.put('/api/users/verify', {ids: ids});
            },

            blockChange: function (id) {
              return $http.put('/api/users/blockChange/' + id);
            },

            getUsers: function (options) {
                var request = '/api/users?';

                if (options.page) {
                    request += 'page=' + options.page + '&';
                }

                _.each(Object.keys(options.query), function(key){
                    if(options.query[key] || (key == 'enabled' && options.query[key] != undefined))
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

            regenerate: function (value) {
                return $http.put('/api/authenticator/regenerate', value)
            },

            reenable: function (value) {
                if(value.reToken){
                    user.reToken = user.reToken.toString().replace(/\s/g,'');
                }
                return $http.put('/api/authenticator/reEnable?token=' + value)
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
            },

            allocate: function (id, knt) {
                return $http.put('/api/users/allocate/' + id, { KNT: knt });
            },

            removeBonus: function (id, data) {
                return $http.put('/api/users/allocate/' + id, { MVPKNT: data });
            },

            allocateHistory: function (id) {
                return $http.get('/api/users/allocate/' + id);
            },

            inviteUS: function (data) {
                return $http.post('/api/users/inviteUS', data);
            },

            getCountry: function () {
                return $http.get('/api/countries')
            },

            createUser: function (user) {
                if (user.nationalityObj) {
                    user.nationality = user.nationalityObj.countryCode;
                }
                if (user.countryObj) {
                    user.country = user.countryObj.countryCode;
                }

                return $http.post('/api/users', user);
            }
        }
    }])
}());