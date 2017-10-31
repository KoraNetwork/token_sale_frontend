(function (window, document) {
'use strict';

angular.module('tablesort', []);

angular.module('tablesort').directive('tablesort', match);

function match ($http) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            filters: '=ngModel'
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.name = attrs.tablesortName;
            scope.title = attrs.tablesortTitle;
        },
        template: '{{ title }}' +
        '<div class="sort">' +
        '<i class="fa fa-sort" ng-show="filters.sort_column != name" ng-click="filters.sort_column = name; filters.sort_type = \'asc\'" ></i>' +
        '<i class="fa fa-sort-asc" ng-show="filters.sort_column == name && filters.sort_type == \'asc\'" ng-click="filters.sort_column = name; filters.sort_type = \'desc\'"></i>' +
        '<i class="fa fa-sort-desc" ng-show="filters.sort_column == name && filters.sort_type == \'desc\'" ng-click="filters.sort_column = null; filters.sort_type = null"></i>' +
        '</div>'
    };
}
})(window, document);