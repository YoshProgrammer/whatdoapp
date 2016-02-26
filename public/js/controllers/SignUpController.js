angular.module('SignUpCtrl', []).controller('SignUpController', ['$scope', 'SignUpService',
	function($scope, SignUpService) {

	$scope.user = {
		email: '',
		password: ''
	};

	$scope.createUser =  function () {
		SignUpService.registerUser($scope.user).then(function (success) {
			console.log('Success: ', success);
		});
	};
}]);