angular.module('ToDoServ', []).factory('ToDoService', ['$http', '$log', '$cookies',
    function ($http, $log, $cookies) {
        'use strict';

        var token = $cookies.get('token'),
            headers = { "Auth": token };

        return {

            newTodo: function () {
                return {
                    description: null,
                    dueDate: null,
                    file: null,
                    fileName: null,
                    priority: null,
                    completed: false
                };
            },

            newEmail: function () {
                return {
                    to: '',
                    from: 'notifications@whatdoapp.com',
                    subject: 'ToDo App Notification',
                    text: '',
                    sendAt: null
                };
            },

            createEmail: function (email) {
                return $http({
                    method: 'POST',
                    url: '/user/send-email',
                    headers: headers,
                    data: email
                }).then(function successCallback(data) {
                    console.log('Data: ', data);
                    return data;
                });
            },

            createTodo: function (todo) {
                $log.debug('Todo: ', todo);
                $log.debug('Token: ', token);
                return $http({
                    method: 'POST',
                    url: '/api/todos',
                    headers: headers,
                    data: todo
                }).then(function successCallback(data) {
                    return data;
                });
            },

            updateTodo: function (todo) {
                return $http({
                    method: 'PUT',
                    url: '/api/todos/' + todo.id,
                    headers: headers,
                    data: todo
                }).then(function successCallback(data) {
                    return data;
                });
            },

            getTodo: function (id) {
                return $http({
                    method: 'GET',
                    url: '/api/todos/' + id,
                    headers: headers
                }).then(function succssCallback(response) {
                    console.log('Data: ', response);
                    return response.data;
                });
            },

            getTodos: function () {
                return $http({
                    method: 'GET',
                    url: '/api/todos',
                    headers: headers
                }).then(function succssCallback(data) {
                    return data;
                });
            },

            deleteTodo: function (id) {
                return $http({
                    method: 'DELETE',
                    url: '/api/todos/' + id,
                    headers: headers
                }).then(function successCallback(data) {
                    return data;
                });
            }

        };

    }]);
