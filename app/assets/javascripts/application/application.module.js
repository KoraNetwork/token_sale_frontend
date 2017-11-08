(function () {
    "use strict";
    var KoraICOFrontendApp = angular.module('KoraICOFrontendApp', [
        'ui.router',
        'templates',
        'ngDialog',
        'validation.match',
        'validation.email',
        'fileread',
        'ui.bootstrap',
        'bootstrapLightbox',
        'ui-rangeSlider',
        'redactor',
        'formInput.images',
        'formInput.image',
        'toaster',
        'angular-ladda',
        'AuthHttp',
        'oitozero.ngSweetAlert',
        'tablesort'
    ]);

    KoraICOFrontendApp.config(['$urlRouterProvider', '$stateProvider', '$httpProvider',
        function ($urlRouterProvider, $stateProvider, $httpProvider) {

            $httpProvider.defaults.headers.common['X-Requested-With'] = 'AngularXMLHttpRequest';
            $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('home',{
                  url: '',
                  templateUrl: 'application/templates/home/index.html',
                  controller: 'HomeController'
                })
                .state('profile',{
                    url: '/profile',
                    templateUrl: 'application/templates/users/edit.html',
                    controller: 'UsersController'
                })
                .state('login',{
                    url: '/login',
                    templateUrl: 'application/templates/sessions/login.html',
                    controller: 'SessionsController'
                })
                .state('forgot_password',{
                    url: '/forgot_password',
                    templateUrl: 'application/templates/passwords/new.html',
                    controller: 'PasswordsController'
                })
                .state('register',{
                    url: '/register',
                    templateUrl: 'application/templates/users/new.html',
                    controller: 'UsersController'
                });
    }]);

    KoraICOFrontendApp.run(['$http', '$rootScope', function($http, $rootScope){
        var csrf_token = $('meta[name="csrf-token"]').attr('content');
        $http.defaults.headers.common['X-CSRF-Token'] = csrf_token;
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    }]);

}());