(function () {
    'use strict';
    angular.module('KoraICOFrontendApp').factory('CountryFlagsFactory', ['$http', function($http){
        return {
            all: function(){
                var request = '/api/countries';
                return $http.get(request);
            }
        }
    }])
}());