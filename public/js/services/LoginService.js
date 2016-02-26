angular.module('LoginServ', []).factory('LoginService', ['$http', function($http) {
    'use strict';

    return {

        login: function (user) {
            return $http({
                method: 'POST',
                url: '/api/users/login',
                data: {
                    email: user.email,
                    password: user.password
                }
            }).then(function successCallback(data) {
                console.log('Successful login');
                return data;
            });
        }
    };

}]);