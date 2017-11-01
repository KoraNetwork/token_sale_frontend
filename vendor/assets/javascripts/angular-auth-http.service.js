'use strict';

angular.module('AuthHttp', ['toaster']);

angular.module('AuthHttp').service('AuthHttp', ['$http', 'toaster', function($http, toaster){
    var qw = function(){
        return {
            success: function (callback) {
                this.callbacks.success = callback;
                return this;
            },
            error: function (callback) {
                this.callbacks.error = callback;
                return this;
            },
            request: function (method, url, data) {
                var self = this;

                var success = function(data, status, headers, config){
                    if(data.message){
                        toaster.pop('success', "", data.message);
                    }
                    self.callbacks.success(data, status, headers, config);
                };

                var error = function(data, status, headers, config){
                    if(data.errors){
                        for(var i = 0; i < data.errors.length; ++i) {
                            toaster.pop('error', "", data.errors[i]);
                        }
                    }
                    if (status == 401) {
                        window.location = '/#/login'
                    }
                    self.callbacks.error(data, status, headers, config);
                };

                if(data && data.toString().indexOf('FormData') >= 0){

                    switch(method){
                        case 'GET':
                            $http.get(url, data, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            })
                                .success(function (data, status, headers, config) {
                                    success(data, status, headers, config);
                                })
                                .error(function (data, status, headers, config) {
                                    error(data, status, headers, config);
                                });
                            break;
                        case 'POST':
                            $http.post(url, data, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            })
                                .success(function (data, status, headers, config) {
                                    success(data, status, headers, config);
                                })
                                .error(function (data, status, headers, config) {
                                    error(data, status, headers, config);
                                });
                            break;
                        case 'PUT':
                            $http.put(url, data, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            })
                                .success(function (data, status, headers, config) {
                                    success(data, status, headers, config);
                                })
                                .error(function (data, status, headers, config) {
                                    error(data, status, headers, config);
                                });
                            break;
                        case 'DELETE':
                            $http.delete(url, data, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            })
                                .success(function (data, status, headers, config) {
                                    success(data, status, headers, config);
                                })
                                .error(function (data, status, headers, config) {
                                    error(data, status, headers, config);
                                });
                            break;
                    }
                }else{
                    var req = {
                        async: true,
                        cache: false,
                        method: method,
                        url: url,
                        data: data
                    };

                    $http(req)
                        .success(function (data, status, headers, config) {
                            success(data, status, headers, config);
                        })
                        .error(function (data, status, headers, config) {
                            error(data, status, headers, config);
                        });
                }
            },
            callbacks: {
                success: function () {
                },
                error: function () {
                }
            }
        }
    };

    return {
        get: function (url) {
            var ins = new qw;
            ins.request('GET', url);
            return ins;
        },
        post: function (url, data) {
            var ins = new qw;
            ins.request('POST', url, data);
            return ins;
        },
        put: function (url, data) {
            var ins = new qw;
            ins.request('PUT', url, data);
            return ins;
        },
        delete: function (url, data) {
            var ins = new qw;
            ins.request('DELETE', url, data);
            return ins;
        },
        download: function(url, options){
            var input;
            var button = $('<button type="submit">Download!</button>');
            var form = $('<form method="get" action="' + url + '"></form>');
            _.each(Object.keys(options.query), function(key){
                input = $('<input type="text" name="'+ key +'" value="' + options.query[key] +'" />');
                form.append(input)
            });
            form.append(button);
            $('body').append(form);
            button.click();
            form.remove();
        }
    }
}]);