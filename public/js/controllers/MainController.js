angular.module('MainCtrl', []).controller('MainController', ['$scope', 'AuthService',
	function($scope, AuthService) {

	$scope.logout = function () {
		AuthService.logout().then(function (response) {
			console.log('Woo: ', response);
		});
	};

}]);