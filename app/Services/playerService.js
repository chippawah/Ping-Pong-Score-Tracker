var app = angular.module('scoreKeep');

app.service('playerService', function($rootScope, $location){

	this.getPlayerNames = function(player) {

		debugger;

		switch (player) {

			case 'player1':

				return playerNames.player1Name;

			case 'player2':

				return playerNames.player2Name;
		};

	};
});