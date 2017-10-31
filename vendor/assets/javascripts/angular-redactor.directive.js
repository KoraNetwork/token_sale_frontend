'use strict';

angular.module('redactor', []);

angular.module('redactor').directive('redactor', ['$filter', function($filter) {

    function link(scope, element, attributes, ctrl) {

        var redactor_element = $('<div></div>');

        element.append(redactor_element);

        redactor_element.redactor({
            changeCallback: function()
            {
                var self = this;
                scope.$apply(function(){
                    scope.redactorModel = self.code.get()
                });
            },
            codeKeyupCallback: function()
            {
                var self = this;
                scope.$apply(function(){
                    scope.redactorModel = self.code.get()
                });
            },
            buttonSource: true,
            imageUpload: element.attr('file-upload-path'),
            fileUpload: element.attr('file-upload-path'),
            plugins: ['table', 'video']
        });

        var redactor_initialized = 0;
        scope.$watch('redactorModel', function(){
            if(!scope.redactorModel){
                scope.redactorModel = '';
            }
            if(redactor_initialized < 3){
                redactor_element.redactor('code.set', scope.redactorModel);
                redactor_initialized++;
            }
        });

    }

    return {
        link: link,
        restrict: 'A',
        require: 'ngModel',
        scope: {
            redactorModel: '=ngModel'
        }
    };
}]);