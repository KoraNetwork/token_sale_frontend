(function () {
    'use strict';
    angular.module('KoraICOAdminApp').factory('SessionsFactory', ['$http', function($http){
        return {
            profile: function(){
                return $http.get('/api/profile');
            },

            login: function(session){
                return $http.post('/api/auth/login', session || {})
            },

            logout: function(){
                return $http.delete('/api/auth/logout')
            },

            authRecovery: function (data) {
              if(data.email) {
                data.email = data.email.replace(/\s/g,'');
              }
              return $http.post('/api/authenticator/recovery', data || {})
            },

            sendImage: function (data) {

                var body = new FormData();

                if(data.image && data.image.file) {
                    body.append('photo', data.image.file);
                }

                return $http.put('/api/authenticator/recovery/' + data.id, body, {
                    headers: { 'Content-Type': undefined }
                })
            },
            
            changePassword: function (options) {
                return $http.put('/api/password/change', options, {
                    headers: { 'Content-Type': undefined }
                })
            }
        }
    }])
}());