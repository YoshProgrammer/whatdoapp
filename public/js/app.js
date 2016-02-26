var whatdoapp = angular.module('whatdoapp', [
    'ngRoute',
    'ngCookies',
    'loading-bar',
    'fab-directive',
    'enplug.sdk.utils',
    'enplug.utils',
    'ui.bootstrap',
    'ui.gravatar',
    'ngDialog',
    'NavCtrl',
    'CreateTodoCtrl',
    'MainCtrl',
    'LoginCtrl',
    'SignUpCtrl',
    'TodosCtrl',
    'AccountCtrl',
    'AuthServ',
    'LoginServ',
    'SignUpServ',
    'ToDoServ',
    'ScriptLoaderService',
    'angular-filepicker',
    'angular-loading-bar',
    'oitozero.ngSweetAlert',
    'datepicker'
]);

whatdoapp.config(['$routeProvider', '$locationProvider', 'filepickerProvider', 'cfpLoadingBarProvider',
    function ($routeProvider, $locationProvider, filepickerProvider, cfpLoadingBarProvider) {

        filepickerProvider.setKey('AWcZnYpZyQrOBLrdpNDNzz');
        $locationProvider.html5Mode(true);

        $routeProvider

        // home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController',
                resolve: {
                    loggedIn: ['AuthService', '$location', '$route', function (AuthService, $location, $route) {
                        if (!AuthService.isLoggedIn()) {
                            $location.path('/login');
                        }
                    }]
                }
            })

            .when('/user/account', {
                templateUrl: 'views/account.html',
                controller: 'AccountController',
                resolve: {
                    user: ['AuthService', function (AuthService) {
                        return AuthService.getUser();
                    }],

                    todos: ['AuthService', '$location', 'ToDoService', function (AuthService, $location, ToDoService) {
                        return ToDoService.getTodos();
                    }]
                }
            })

            .when('/signup', {
                templateUrl: 'views/sign-up.html',
                controller: 'SignUpController'
            })

            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })

            .when('/user/add-todo', {
                templateUrl: 'views/create-todo.html',
                controller: 'CreateTodosController',
                resolve: {
                    todo: function () {
                        return null;
                    },

                    user: ['AuthService', function (AuthService) {
                        return AuthService.getUser();
                    }]
                }
            })

            .when('/todo/edit/:todoId', {
                templateUrl: 'views/create-todo.html',
                controller: 'CreateTodosController',
                resolve: {
                    todo: ['ToDoService', '$route', function (ToDoService, $route) {
                        return ToDoService.getTodo($route.current.params.todoId);
                    }],

                    user: ['AuthService', function (AuthService) {
                        return AuthService.getUser();
                    }]
                }
            })

            .when('/user/todos', {
                templateUrl: 'views/todos.html',
                controller: 'TodosController',
                resolve: {
                    todos: ['AuthService', '$location', 'ToDoService', function (AuthService, $location, ToDoService) {
                        return ToDoService.getTodos();
                    }]
                }
            })

            .otherwise({redirectTo: '/'});

    }]);
