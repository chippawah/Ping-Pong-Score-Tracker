var app = angular.module('scoreKeep');

app.controller('homePageCtrl', function($scope, playerService){

	$scope.savePlayerNames = function() {

		var player1Name = $scope.name1;
		var player2Name = $scope.name2;

		playerService.savePlayerNames(player1Name, player2Name);

		$scope.name1 = '';

		$scope.name2 = '';

	};

	$scope.playAsGuests = function() {

		var player1Name = 'Player 1';
		var player2Name = 'Player 2';

		playerService.savePlayerNames(player1Name, player2Name);

	};

});