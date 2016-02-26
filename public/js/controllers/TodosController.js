angular.module('TodosCtrl', []).controller('TodosController',
    ['$scope', 'ToDoService', '$cookies', 'todos', 'Confirm', '$route', '$timeout', 'SweetAlert', '$location',
    function($scope, ToDoService, $cookies, todos, Confirm, $route, $timeout, SweetAlert, $location) {

    $scope.todos = todos.data;

    $scope.priorityLevelsMap = {
        1: 'Major',
        2: 'Normal',
        3: 'Minor'
    };

    $scope.deleteTodo = function (todo) {
        var title = 'Delete todo?',
            text = 'Are you sure you want to delete the todo: '+ todo.description + '? This action cannot be undone.';
        SweetAlert.confirm(title, text, deleteTodo, todo);
    };

    $scope.editTodo = function (id) {
        $location.path('/todo/edit/' + id);
    };

    $scope.markCompleted = function (todo) {
        updateTodo(todo).then(function () {
            $route.reload();
        });
    };

    function updateTodo(todo) {
        var completed = todo.completed ? ' completed' : ' uncompleted';

        return ToDoService.updateTodo(todo).then(function (todo) {
            console.log('Todo', todo);
            SweetAlert.success('Todo Status', 'Todo marked as ' + completed);
        }, function (error) {
            console.log('Error');
            SweetAlert.error('Oops', 'An error has occurred. Please try again.');
        });
    }

    function deleteTodo(todo) {
        return ToDoService.deleteTodo(todo.id).then(function (){
            $route.reload();
        });
    }

}]);