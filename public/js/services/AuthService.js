angular.module('AuthServ', []).factory('AuthService', ['$http', '$log', '$cookies',
    function($http, $log, $cookies) {
    'use strict';

    return {

        isLoggedIn: function () {
            return !!($cookies.get('token') && $cookies.get('token').length > 15);
        },

        logout: function () {
            console.log('Hit @ logout', $cookies.get('token'));
            return $http({
                method: 'POST',
                url: '/api/logout',
                headers: { 'Auth': $cookies.get('token') }
            }).then(function (data) {
                $cookies.put('token', '', {expires: '-1'});
                console.log('Cookie: ', $cookies.get('token'));
                return data;
            });
        },

        getUser: function () {
            return $http({
                method: 'GET',
                url: '/api/user',
                headers: { 'Auth': $cookies.get('token') }
            }).then(function (user) {
                console.log('User: ', user);
                return user;
            });
        }
    };

}]);
