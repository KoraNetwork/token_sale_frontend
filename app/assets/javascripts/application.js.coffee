#= require jquery
#= require jquery_ujs
#= require bootstrap
#= require bootstrap-sprockets
#= require angular
#= require angular-rails-templates
#= require angular-ui-router
#= require angular-ng-dialog
#= require angular-input-match
#= require angular-email-available
#= require angular-file-input
#= require angular-redactor.directive
#= require angular-images.directive
#= require angular-image.directive
#= require angular-table-sort.directive
#= require toastr
#= require underscore/underscore-min.js
#= require i18n
#= require i18n/translations
#= require angular-range-slider
#= require_tree ../../../vendor/assets/javascripts/redactor
#= require twbs-pagination.js
#= require angular-ui-bootstrap/dist/ui-bootstrap-tpls
#= require selectize
#= require angular-bootstrap-lightbox
#= require metisMenu/jquery.metisMenu.js
#= require pace/pace.min.js
#= require peity/jquery.peity.min.js
#= require ui-select
#= require slimscroll/jquery.slimscroll.min.js
#= require inspinia.js
#= require wow
#= require scrollspy
#= require icheck
#= require spin
#= require slick/slick
#= require ladda
#= require angular-ladda
#= require sweetalert/dist/sweetalert.min
#= require angular-sweetalert/SweetAlert
#= require moment/min/moment.min.js
#= require onfido-sdk-ui/dist/onfido.min.js
# load angular modules
#= require ./application/application.module.js
#= require_tree ./application/factories
#= require_tree ./application/controllers
#= require_tree ./application/templates
#= require_tree .

$(document).ready ->
  $('#side-menu').slimScroll
    height: '100%'