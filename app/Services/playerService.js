var app = angular.module('scoreKeep');

app.service('playerService', function($rootScope, $location){

	this.getPlayerNames = function() {

		return $rootScope.playerNames;

	};

	this.savePlayerNames = function(name1, name2) {


		$rootScope.playerNames = {

			player1Name: name1,
			player2Name: name2

		};

		$location.path('/game')

	};

});