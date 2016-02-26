angular.module('AccountCtrl', []).controller('AccountController', ['$scope', 'user', 'todos', function($scope, user, todos) {
    'use strict';

    $scope.user = user.data;
    $scope.todos = todos.data;
    $scope.totalTodos = todos.data.length + ' todos. View';
    console.log('User: ', user);

}]);