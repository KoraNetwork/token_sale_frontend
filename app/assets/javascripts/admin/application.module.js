(function () {
    "use strict";
    var KoraICOAdminApp = angular.module('KoraICOAdminApp', [
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

    KoraICOAdminApp.config(['$urlRouterProvider', '$stateProvider', '$httpProvider',
        function ($urlRouterProvider, $stateProvider, $httpProvider) {

            $httpProvider.defaults.headers.common['X-Requested-With'] = 'AngularXMLHttpRequest';
            $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('users', {
                  url: '/',
                  templateUrl: 'admin/templates/home/index.html',
                  controller: 'UsersController'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'admin/templates/sessions/login.html',
                    controller: 'SessionsController'
                })
                .state('forgot_password', {
                    url: '/forgot_password',
                    templateUrl: 'admin/templates/passwords/new.html',
                    controller: 'PasswordsController'
                })
                .state('user', {
                    url: '/user/:id',
                    templateUrl: 'admin/templates/home/show.html',
                    controller: 'UsersController'
                })
                .state('tokens', {
                    url: '/tokens',
                    templateUrl: 'admin/templates/manage_tokens/index.html',
                    controller: 'TokensController'
                })
                .state('ga_requests', {
                    url: '/ga_requests',
                    templateUrl: 'admin/templates/ga_requests/index.html',
                    controller: 'GARequestsController'
                })
                .state('admins', {
                    url: '/admins',
                    templateUrl: 'admin/templates/admins/index.html',
                    controller: 'AdminsController'
                })
                .state('admins_password', {
                    url: '/create_password/:token',
                    templateUrl: 'admin/templates/admins/create_password.html',
                    controller: 'AdminsController'
                })
                .state('transactions', {
                    url: '/transactions',
                    templateUrl: 'admin/templates/transactions/index.html',
                    controller: 'TransactionsController'
                });
    }]);

    KoraICOAdminApp.run(['$http', '$rootScope', function($http, $rootScope){
        $(document).ready(function () {
            var count = 0;
            function getCSRF () {
                $http.get('/csrfToken')
                    .success(function (data) {
                        if (data && data._csrf) {
                            $http.defaults.headers.common['X-CSRF-Token'] = data ? data._csrf : null;
                        } else {
                            if (count++ < 4)  getCSRF();
                        }
                    })
                    .error(function() {
                        if (count++ < 4)  getCSRF();
                    });
            }
            getCSRF();

        });
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    }]);

}());