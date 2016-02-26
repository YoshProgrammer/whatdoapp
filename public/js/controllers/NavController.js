angular.module('NavCtrl', []).controller('NavTitleController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {
        'use strict';

        $scope.logout = function () {
            AuthService.logout().then(function () {
                $scope.hideTitle = true;
                $location.path('/login');
            });
        };

        $scope.$on('$routeChangeSuccess', function () {
            $scope.hideTitle = !!($location.path() === '/login' || $location.path() === '/signup');
            $scope.hideHome = $location.path() === '/';
        });



        AuthService.getUser().then(function (user) {
            console.log('Data: ', user);
            $scope.user = user.data;
        });
}]);