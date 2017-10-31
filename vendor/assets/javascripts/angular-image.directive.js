'use strict';

angular.module('formInput.image', []);

angular.module('formInput.image').directive('image', ['$filter', function($filter) {

    function link(scope, element, attributes, ctrl) {

        var droppable_area = element.find('.droppable-area');
        var file_select = element.find('.file-select');

        scope.$watch('image', function(){
            if(!scope.image){
                scope.image = {removed: true};
            }
        });

        scope.removeImage = function(e){
            e.stopPropagation();
            e.preventDefault();
            scope.image.removed = true;
            scope.image.base64 = null;
            scope.image.url = null;
            return false;
        };

        var addImage = function(image){
            var base64 ='';
            if(image.type.indexOf("image") > -1) {
                var reader = new FileReader();
                reader.onload = function(e){
                    scope.$apply(function(){
                        scope.image = {file: image, base64: e.target.result, removed: false };
                    });
                };
                reader.readAsDataURL(image);
            }else{

            }
        };

        if (window.File && window.FileList && window.FileReader) {

            file_select[0].addEventListener("change", function(e){
                FileDragHover(e);
                var files = e.target.files || e.dataTransfer.files;
                if(files.length > 0) {
                    addImage(files[0]);
                }
            }, false);

            var xhr = new XMLHttpRequest();
            if (xhr.upload) {

                var FileDragHover = function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if(e.type == 'dragover') {
                        droppable_area.addClass('file-hover')
                    }else{
                        droppable_area.removeClass('file-hover')
                    }
                };

                var FileSelectHandler = function(e) {
                    FileDragHover(e);

                    var files = e.target.files || e.dataTransfer.files;

                    if(files.length > 0) {
                        addImage(files[0]);
                    }
                };

                droppable_area[0].addEventListener("dragover", FileDragHover, false);
                droppable_area[0].addEventListener("dragleave", FileDragHover, false);
                droppable_area[0].addEventListener("drop", FileSelectHandler, false);
            }
        }
    }

    return {
        link: link,
        restrict: 'A',
        require: 'ngModel',
        scope: {
            image: '=ngModel'
        },
        template: "<div class='droppable-area'>" +
        "<ul class='images-list' >" +
        '<li class="plus" style="background-image: url(\'{{ image.base64 || image.url }}\')">' +
        "<label>" +
        '<i class="fa fa-plus" ng-show="image.removed"/>' +
        '<input type="file" class="file-select" />' +
        "</label>" +
        '<i class="fa fa-close" ng-click="removeImage($event)" ng-hide="image.removed"/>' +
        "</li>" +
        "<ul>" +
        "</div>"
    };
}]);