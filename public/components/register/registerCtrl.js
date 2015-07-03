var app = angular.module('scoreKeep');

app.controller('registerCtrl', function($scope, playerService) {

	$scope.playerObj = {

		name: null,
		email: null,
		phone: null,
		password: null,
		winLoss: null,
		streaking: null

	};

	$scope.savePlayer = function() {

		var date = Date.now();

		$scope.playerObj.createdAt = date;

		playerService.saveNewPlayer($scope.playerObj);

		$scope.playerObj = {};

	};

});