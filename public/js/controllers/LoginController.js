angular.module('LoginCtrl', []).controller('LoginController',
	['$scope', 'LoginService', '$cookies', '$location', 'SignUpService','SweetAlert',
	function($scope, LoginService, $cookies, $location, SignUpService, SweetAlert) {
	'use strict';

	$scope.user = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		accountName: ''
	};

	$scope.createAccount = null;

	$scope.toggleAccount = function () {
		$scope.createAccount = !$scope.createAccount;
	};

	$scope.login =  function () {
		return LoginService.login($scope.user).then(function (userObject) {
			$cookies.put('token', userObject.data._token);
			$location.path('/');
		}, function() {
			handleError('Invalid username or password, try again');
		});
	};

	$scope.createUser =  function () {
		createUser().then(function() {
			$scope.login();
		}, function (error) {
			handleError('Something went wrong.');
		});
	};

	function handleError(message) {
		SweetAlert.error('Oops', message);
	}

	function createUser() {
		return SignUpService.registerUser($scope.user);
	}

}]);