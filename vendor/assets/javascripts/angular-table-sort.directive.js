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
        '<i class="fa fa-sort" ng-show="filters.sort != name + \' ASC\' && filters.sort != name + \' DESC\'" ng-click="filters.sort = name + \' ASC\'" ></i>' +
        '<i class="fa fa-sort-asc" ng-show="filters.sort == name + \' ASC\'" ng-click="filters.sort = name + \' DESC\'"></i>' +
        '<i class="fa fa-sort-desc" ng-show="filters.sort == name + \' DESC\'" ng-click="filters.sort = null"></i>' +
        '</div>'
    };
}
})(window, document);