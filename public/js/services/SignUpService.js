angular.module('SignUpServ', []).factory('SignUpService', ['$http', '$log', function($http, $log) {
    'use strict';

    return {

        registerUser: function (user) {
            return $http({
                method: 'POST',
                url: '/api/user',
                data: {
                    email: user.email,
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accountName: user.accountName
                }
            }).then(function (data) {
                return data;
            });
        }
    };

}]);
