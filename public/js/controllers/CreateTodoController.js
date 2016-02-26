angular.module('CreateTodoCtrl', []).controller('CreateTodosController',
    ['$scope', 'ToDoService', '$location', 'filepickerService', '$timeout', 'SweetAlert', 'todo', 'user',
        function ($scope, ToDoService, $location, filepickerService, $timeout, SweetAlert, todo, user) {

            $scope.todo = todo || ToDoService.newTodo();
            $scope.email = ToDoService.newEmail();

            console.log('Todo: ', $scope.todo);

            $scope.priorityLevels = [
                {name: 'Minor', level: 1},
                {name: 'Normal', level: 2},
                {name: 'Major', level: 3}
            ];

            $scope.createOrUpdateTodo = function () {
                if ($scope.todo.id) {
                    $timeout(updateTodo, 500);
                } else {
                    $timeout(createTodo, 500);
                }
            };

            $scope.sendEmail = function () {
                var text = $scope.todo.dueDate ? $scope.todo.dueDate : 'soon';
                $scope.email.to = user.data.email;
                $scope.email.text = 'Your todo: ' + $scope.todo.description + ' is due ' + text + '. Please login to WhatDo App at http://www.whatdoapp.com to view todos.';
                $scope.email.sendAt = moment().unix();
                ToDoService.createEmail($scope.email).then(function (email) {
                    SweetAlert.success('Success', 'Email successfully scheduled');
                    console.log('Email: ', email);
                }, function (error) {
                    SweetAlert.error('Oops', 'An error has occurred. Please try again.');
                });

            };

            function createTodo() {
                ToDoService.createTodo($scope.todo).then(function (todo) {
                    SweetAlert.success('Success', 'Todo: ' + $scope.todo.description + ' created');
                    console.log('Todo: ', todo);
                    $location.path('/user/todos');
                }, function (error) {
                    console.log('Error');
                    SweetAlert.error('Oops', 'An error has occurred. Please try again.');
                });
            }

            function updateTodo() {
                ToDoService.updateTodo($scope.todo).then(function (todo) {
                    SweetAlert.success('Success', 'Todo: ' + $scope.todo.description + ' updated');
                    $location.path('/user/todos');
                }, function (error) {
                    console.log('Error');
                    SweetAlert.error('Oops', 'An error has occurred. Please try again.');
                });
            }

            $scope.today = function () {
                $scope.dt = new Date();
            };

            $scope.pickFile = pickFile;

            $scope.onSuccess = onSuccess;

            function pickFile() {
                filepickerService.pick(
                    onSuccess
                );
            }

            function onSuccess(Blob) {
                console.log('Blob: ', Blob);
                $scope.todo.file = Blob.url;
                $scope.todo.fileName = Blob.filename;
            }

            $scope.today();

            $scope.clear = function () {
                $scope.todo.dueDate = null;
            };

            $scope.open = function ($event) {
                $scope.status.opened = true;
            };

            $scope.setDate = function (year, month, day) {
                $scope.todo.dueDate = new Date(year, month, day);
            };

            $scope.status = {
                opened: false
            };
        }]);