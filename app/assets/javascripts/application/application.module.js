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
        'oitozero.ngSweetAlert',
        'tablesort',
        'ui.select'
    ]);

    KoraICOFrontendApp.config(['$urlRouterProvider', '$stateProvider', '$httpProvider',
        function ($urlRouterProvider, $stateProvider, $httpProvider) {

            $httpProvider.defaults.headers.common['X-Requested-With'] = 'AngularXMLHttpRequest';
            $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('dashboard',{
                  url: '/',
                  templateUrl: 'application/templates/home/index.html',
                  controller: 'DashboardController'
                })
                .state('profile',{
                    url: '/profile',
                    templateUrl: 'application/templates/users/profile.html',
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
                .state('restore_password',{
                    url: '/restore_password/:token',
                    templateUrl: 'application/templates/passwords/restore.html',
                    controller: 'PasswordsController'
                })
                .state('register',{
                    url: '/register',
                    templateUrl: 'application/templates/users/new.html',
                    controller: 'UsersController'
                })
                .state('change_password',{
                  url: '/profile/change_password',
                  templateUrl: 'application/templates/users/change_password.html',
                  controller: 'UsersController'
                })
                .state('update_profile',{
                    url: '/profile/update_profile',
                    templateUrl: 'application/templates/users/update_profile.html',
                    controller: 'UsersController'
                })
                .state('verify_id',{
                    url: '/profile/verify_id',
                    templateUrl: 'application/templates/users/verify_id.html',
                    controller: 'UsersController'
                });
    }]);

    KoraICOFrontendApp.run(['$http', '$rootScope', function($http, $rootScope){
        $(document).ready(function () {
            $http.get('/csrfToken')
                .success(function (data) {
                    $http.defaults.headers.common['X-CSRF-Token'] = data ? data._csrf : null;
                });
        });
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    }]);

}());