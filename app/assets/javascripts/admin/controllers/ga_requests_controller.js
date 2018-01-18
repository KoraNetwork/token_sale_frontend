(function () {

    "use strict";

    angular.module('KoraICOAdminApp')
        .controller('GARequestsController', ['$scope', '$state', 'ngDialog', 'GARequestsFactory', '$timeout', 'toaster',
            function ($scope, $state, ngDialog, ga_requests, $timeout, toaster) {

                $scope.I18n = I18n;
                $scope.$state = $state;

                if($state.current.name == 'ga_requests'){

                    $scope.retriveGARequests = function () {
                        ga_requests.index({page: $scope.page, query: $scope.filters}).success(function (data) {
                            $scope.ga_requests = data.data;
                            $scope.count = data.count;
                            console.log($scope.ga_requests.user.documentUrl)
                            var pagination = $('#ga_requests-pagination');
                            pagination.empty();
                            pagination.removeData('twbs-pagination');
                            pagination.unbind('page');
                            if ($scope.count > 0) {
                                pagination.twbsPagination({
                                    totalPages: Math.ceil($scope.count / $scope.filters.limit),
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
                        });
                    };

                    $scope.resetFilters = function(){
                        $scope.filters = {
                            limit: 10
                        };
                        $scope.page = 1;
                    };

                    $scope.resetFilters();
                    $scope.retriveGARequests();

                    $scope.openImage = function(image){
                        $scope.image = [image];
                        ngDialog.closeAll();
                        ngDialog.open({
                            templateUrl: 'admin/templates/ga_requests/image.html',
                            scope: $scope,
                            className: 'gallery-dialog'
                        });
                    };
                }
            }])
}());