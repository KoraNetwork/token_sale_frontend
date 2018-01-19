(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('GARequestsController', ['$scope', '$state', 'ngDialog', 'GARequestsFactory', '$timeout', 'toaster',
            function ($scope, $state, ngDialog, ga_requests, $timeout, toaster) {

                $scope.I18n = I18n;
                $scope.$state = $state;

                var timer = false;

                $scope.$watch('ga_requests_filters', function () {
                    if (timer) {
                        $scope.page = 1;
                        $timeout.cancel(timer)
                    }
                    timer = $timeout(function () {
                        $scope.retriveGARequests();
                    }, 500)
                }, true);


                $scope.retriveGARequests = function () {
                    ga_requests.index({page: $scope.page, query: $scope.ga_requests_filters}).success(function (data) {
                        $scope.ga_requests = data.data;
                        $scope.count = data.count;
                        var pagination = $('#ga_requests-pagination');
                        pagination.empty();
                        pagination.removeData('twbs-pagination');
                        pagination.unbind('page');
                        if ($scope.count > 0) {
                            pagination.twbsPagination({
                                totalPages: Math.ceil($scope.count / $scope.ga_requests_filters.limit),
                                startPage: $scope.page,
                                prev: '<',
                                next: '>',
                                first: false,
                                last: false,
                                visiblePages: 9,
                                onPageClick: function (event, page) {
                                    $scope.page = page;
                                    $scope.retriveGARequests();
                                }
                            })
                        }
                    }).error(function (data) {
                        $scope.errors({ errors: [data.message] })
                    });
                };

                $scope.resetFilters = function(){
                    $scope.ga_requests_filters = {
                        limit: 10
                    };
                    $scope.page = 1;
                };

                $scope.resetFilters();

                $scope.resetGARequests = function (id) {
                    ga_requests.reset(id)
                        .success(function(data) {
                            $scope.retriveGARequests();
                        })
                };

                $scope.deleteGARequests = function (id) {
                    ga_requests.destroy(id)
                        .success(function(data) {
                            $scope.retriveGARequests();
                        })
                };

                $scope.openImage = function(image){
                    $scope.image = [image];
                    ngDialog.closeAll();
                    ngDialog.open({
                        templateUrl: 'admin/templates/ga_requests/image.html',
                        scope: $scope,
                        className: 'gallery-dialog'
                    });
                };

            $scope.openImage = function(image){
                $scope.image = [image];
                ngDialog.closeAll();
                ngDialog.open({
                    templateUrl: 'admin/templates/ga_requests/image.html',
                    scope: $scope,
                    className: 'gallery-dialog'
                });
            };

            }])
}());