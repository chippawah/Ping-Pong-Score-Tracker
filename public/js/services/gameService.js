var app = angular.module('scoreKeep');
var socket = io.connect('http://localhost:80');

app.service('gameService', function(matchService, $q, $location){

	var updateGame = function (gameObj, matchId) {

		socket.emit('update game', {gameObj: gameObj, matchId: matchId}, function(response) {

			if(response.error) {

				console.log('Error from updateGame: ', response.error);

			} else {

				console.log('Game Updated.');

			};

		});

	}

});
